import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { Speciality } from '../specialities/entities/speciality.entity';
import { SpecialitiesService } from 'src/specialities/specialities.service';
import { UsersService } from '../users/users.service';
import { RolesEnum } from '../users/dto/role.enum';
import { RequestDoctorDto } from './dto/request-doctor.dto';
import { TypeAppointment } from 'src/type_appointments/entities/type_appointment.entity';
import { Schedule, ScheduleByHour } from 'src/schedules/entities';

@Injectable()
export class DoctorsService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @Inject()
    private readonly specialitiesService: SpecialitiesService,

    @Inject()
    private readonly usersService: UsersService,
  ){}

  async create(createDoctorDto: CreateDoctorDto) {
    if(createDoctorDto.specialitiesId.length === 0){
      throw new BadRequestException('Doctors must have 1 or more specialities');
    }

    const { specialitiesId } = createDoctorDto;

    const specialitiesFound: Speciality[] = [];

    for (const specialityId of specialitiesId) {
      specialitiesFound.push(await this.specialitiesService.findOne(specialityId))
    }

    const user = await this.usersService.create(createDoctorDto, RolesEnum.DOCTOR);

    try {
  
      const doctor = this.doctorRepository.create({
        ...user,
        specialities: specialitiesFound,
      });
  
      await this.doctorRepository.save(doctor);
  
      return DoctorMapper.doctorToDoctorDto(doctor);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: RequestPaginationDto) {
    const doctors = await this.doctorRepository.createQueryBuilder("dr")
      .where("isActive = true")
      .skip(paginationDto.offset)
      .limit(paginationDto.limit)
      .leftJoinAndSelect("dr.specialities", "specialities")
      .getManyAndCount();

    const paginationDoctors: ResponsePaginatedDto<ResponseDoctorDto> = {
      elements: doctors[0].map(doctor => DoctorMapper.doctorToDoctorDto(doctor)),
      totalElements: doctors[1],
      limit: paginationDto.limit,
      offset: paginationDto.offset,
    }

    return paginationDoctors;
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepository.findOneBy({ id, isActive: true });

    if(!doctor)
      throw new NotFoundException(`Doctor with id ${id} not found`);
    
    return doctor;
  }

  async findOneByIdAndSpeciality(id:number, speciality: Speciality){

    const doctor = await this.doctorRepository.findOneBy({ 
      id,
      specialities: speciality,
    });

    if(!doctor)
      throw new NotFoundException(`Doctor with id ${id} and speciality ${speciality.name} not found`)

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

  async findDoctorsAvailable(requestDoctorDto: RequestDoctorDto){
    const doctors = await this.doctorRepository.createQueryBuilder('dr')
    .innerJoin('dr.specialities', 'spe')
    .innerJoin(TypeAppointment, 'type', 'type.speciality = spe.id')
    .innerJoin(Schedule, 'sche', 'sche.doctor.id = dr.id')
    .innerJoin(ScheduleByHour, 'schebyhour', 'schebyhour.schedule = sche.id')
    .where('spe.id = :typeId', {
      typeId: requestDoctorDto.typeId,
    })
    .andWhere('sche.date = :date', {
      date: requestDoctorDto.date
    })
    .andWhere('schebyhour.startHour = :startHour', {
      startHour: requestDoctorDto.startHour
    })
    .andWhere('dr.isActive = true')
    .getMany();

    return doctors.map(doctor => DoctorMapper.doctorToDoctorDto(doctor));
  }

  async remove(id: number) {
    const doctor = await this.findOne(id);
    await this.usersService.deleteOne(id);

    doctor.isActive = false;
    await this.doctorRepository.save(doctor);
  }
}
