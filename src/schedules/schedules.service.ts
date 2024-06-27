import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { CreateScheduleDto, RequestScheduleDto, ResponseScheduleDto } from './dto';
import { ScheduleByHour } from './entities';
import {  ResponsePaginatedDto } from '../common/dtos';
import { ScheduleMapper } from './mapper/schedule.mapper';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { SchedulesDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(ScheduleByHour)
    private readonly scheduleByHourRepository: Repository<ScheduleByHour>,

    @Inject()
    private readonly doctorService: DoctorsService,
  ){}

  async create(createScheduleDto: CreateScheduleDto) {
    const { schedulesDto } = createScheduleDto;
    const doctor = await this.doctorService.findOne(createScheduleDto.doctorId);

    const schedulesToSave: Schedule[] = [];
    const schedulesByHour: ScheduleByHour[] = [];
  
    for (const iterator in schedulesDto) {
      const scheduleDto = schedulesDto[iterator]
      if(scheduleDto.startTime >= scheduleDto.endTime){
        throw new BadRequestException(`endTime ${scheduleDto.endTime} must be greater than startTime ${scheduleDto.startTime}`);
      }

      const scheduleSaved = await this.findByDoctorAndSchedule(doctor, scheduleDto);
      if(scheduleSaved)
        throw new BadRequestException(`Date ${scheduleSaved.date} with schedule ${scheduleDto.startTime}-${scheduleDto.endTime} is already included in schedule ${scheduleSaved.startTime}-${scheduleSaved.endTime}`);

      let startHour = scheduleDto.startTime;
      let finalHour = scheduleDto.startTime + 1;

      schedulesToSave.forEach(schedule => {
        if(schedule.date === scheduleDto.date && 
          (schedule.startTime <= scheduleDto.startTime && scheduleDto.startTime < schedule.endTime || scheduleDto.startTime < schedule.startTime && scheduleDto.endTime > schedule.startTime)){
          throw new BadRequestException(`Date ${schedule.date} with schedule ${scheduleDto.startTime}-${scheduleDto.endTime} is already included in schedule ${schedule.startTime}-${schedule.endTime}`);
        }
      })

      while(finalHour <= scheduleDto.endTime){
        schedulesByHour.push(
          this.scheduleByHourRepository.create({
            startHour,
            finalHour,
          })
        )
        startHour = finalHour;
        finalHour += 1;
      }

      schedulesToSave.push(
        this.scheduleRepository.create({
          doctor,
          schedulesByHour,
          date: scheduleDto.date,
          startTime: scheduleDto.startTime,
          endTime: scheduleDto.endTime,
        })
      );
    }

    await this.scheduleRepository.save(schedulesToSave);

    return 'Schedule created successfully'
  }

  async findAll(requestScheduleDto: RequestScheduleDto) {

    const schedules = await this.scheduleRepository
      .createQueryBuilder('sr')
      .where(`(:doctorId is null or sr.doctor = :doctorId)`, {
        doctorId: requestScheduleDto.doctorId,
      })
      .andWhere(`(:startTime is null or sr.startTime = :startTime)`, {
        startTime: requestScheduleDto.startTime,
      })
      .andWhere(`(:date is null or sr.date = :date)`, {
        date: requestScheduleDto.date,
      })
      .leftJoinAndSelect('sr.doctor', 'srDoctor')
      .orderBy('srDoctor.id', 'ASC')
      .take(requestScheduleDto.limit)
      .skip(requestScheduleDto.offset)
      .getManyAndCount();


    let responsePaginatedDto: ResponsePaginatedDto<ResponseScheduleDto> = {
      elements: schedules[0].map(schedule => ScheduleMapper.scheduleToScheduleDto(schedule)),
      totalElements: schedules[1],
      limit: requestScheduleDto.limit,
      offset: requestScheduleDto.offset,
    }

    return responsePaginatedDto;
  }

  async findByDoctorAndSchedule(doctor: Doctor, scheduleDto: SchedulesDto) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('sr')
      .where(':date = sr.date AND (:startHour >= sr.startTime AND :startHour < sr.endTime)', {
        date: scheduleDto.date,
        startHour: scheduleDto.startTime,
      })
      .orWhere(':date = sr.date AND (:startHour <= sr.startTime AND :endHour > sr.startTime)', {
        date: scheduleDto.date,
        startHour: scheduleDto.startTime,
        endHour: scheduleDto.endTime,
      })
      .getOne();

    return schedules;
  }

  remove(id: number) {
    //TODO verify the appointments where it tries remove
  }
}
