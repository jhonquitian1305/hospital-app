import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { CreatePatientDto } from 'src/patients/dto/create-patient.dto';


import * as bcrypt from "bcrypt";
import { HandleError } from '../common/handle-errors/handle-errors';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}

  async create(createUserDto: CreatePatientDto | CreateDoctorDto, roleId: number) {

    try {
      const { password, ...userData } = createUserDto;
  
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
        role: { id : roleId },
      });    
      
      return await this.userRepository.save(user);     
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async deleteOne(id: number){
    const user = await this.userRepository.findOneBy({ id });

    if(!user)
      throw new NotFoundException(`User with id ${id} not found`);

    user.isActive = false;

    this.userRepository.save(user);
  }
}
