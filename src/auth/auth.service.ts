import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject()
    private readonly jwtService: JwtService
  ){}

  async login(loginDto: LoginDto){
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
      select: { id: true, password: true, fullname: true, }
    });

    if(!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    return {
      token: this.getJwtToken({ 
        id: user.id,
        fullname: user.fullname, 
        role: user.role.name,
      }),
    };
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);

    return token;
  }
}
