import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { HandleError } from '../common/handle-errors/handle-errors';
import { DoctorMapper } from './mapper/doctor.mapper';
import { RequestPaginationDto, ResponsePaginatedDto } from 'src/common/dtos';
import { ResponseDoctorDto } from './dto/response-doctor.dto';

@Injectable()
export class DoctorsService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>
  ){}

  async create(createDoctorDto: CreateDoctorDto) {
    try {
      const { password, ...doctorData } = createDoctorDto;
  
      const doctor = this.doctorRepository.create({
        ...doctorData,
        password: bcrypt.hashSync(password, 10),
      });
  
      await this.doctorRepository.save(doctor);
  
      return DoctorMapper.doctorToDoctorDto(doctor);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: RequestPaginationDto) {
    const doctors = await this.doctorRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    });

    const paginationDoctors: ResponsePaginatedDto<ResponseDoctorDto> = {
      elements: doctors[0].map(doctor => DoctorMapper.doctorToDoctorDto(doctor)),
      totalElements: doctors[1],
      limit: paginationDto.limit,
      offset: paginationDto.offset,
    }

    return paginationDoctors;
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepository.findOneBy({ id });

    if(!doctor)
      throw new NotFoundException(`Doctor with id ${id} not found`);
    
    return doctor;
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    try {
      const { password, ...doctorData } = updateDoctorDto;

      const doctor = await this.doctorRepository.preload({
        id,
        ...doctorData,
      });

      if(!doctor)
        throw new NotFoundException(`Doctor with id ${id} not found`);

      await this.doctorRepository.save(doctor);

      return DoctorMapper.doctorToDoctorDto(doctor);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);

    doctor.isActive = false;
    await this.doctorRepository.save(doctor);
  }
}
