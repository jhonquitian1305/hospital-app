import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateUserDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

import { HandleError } from '../common/handle-errors/handle-errors';
import { RequestPaginationDto } from 'src/common/dtos/request-pagination.dto';
import { ResponsePaginatedDto } from 'src/common/dtos/response-pagination.dto';
import { ResponsePatientDto } from './dto/response-patient.dto';
import { PatientMapper } from './mapper/patient.mapper';

@Injectable()
export class PatientsService {

  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>
  ){}

  async create(createUserDto: CreatePatientDto) {
    try {
      const { password, ...userData } = createUserDto;
  
      const user = this.patientsRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
  
      await this.patientsRepository.save(user);
  
      return PatientMapper.patientToPatientDto(user);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: RequestPaginationDto) {
    const users = await this.patientsRepository.createQueryBuilder()
      .where("isActive = true")
      .take(paginationDto.limit)
      .skip(paginationDto.offset)
      .getManyAndCount();    

    const paginationUsers: ResponsePaginatedDto<ResponsePatientDto> = {
      elements: users[0].map(user => PatientMapper.patientToPatientDto(user)),
      totalElements: users[1],
      limit: paginationDto.limit,
      offset: paginationDto.offset,
    };

    return paginationUsers;
  }

  async findOne(id: number) {
    const user = await this.patientsRepository.findOneBy({ id, isActive: true });

    if(!user)
      throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { password, ...userData } = updateUserDto;

      const user = await this.patientsRepository.preload({
        id,
        ...userData,
      });

      if(!user) throw new NotFoundException(`User with id: ${id} not found`);

      await this.patientsRepository.save(user);

      return PatientMapper.patientToPatientDto(user);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }

  }

  async remove(id: number) {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.patientsRepository.save(user);
  }
}
