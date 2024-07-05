import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../doctors/entities/doctor.entity';

import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,

    @Inject()
    private readonly jwtService: JwtService
  ){}

  async loginUser(loginDto: LoginDto){
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: { id: true, password: true }
    });

    if(!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    return {
      token: this.getJwtToken({ id: user.id }),
    };
  }
  
  loginDoctor(loginDto: LoginDto){
    
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);

    return token;
  }
}
