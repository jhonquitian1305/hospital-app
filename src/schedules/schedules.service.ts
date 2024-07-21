import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { DataSource, Repository } from 'typeorm';
import { DoctorsService } from '../doctors/doctors.service';
import { CreateScheduleDto, RequestScheduleDto, ResponseScheduleDto } from './dto';
import { ScheduleByHour } from './entities';
import {  ResponsePaginatedDto } from '../common/dtos';
import { ScheduleMapper } from './mapper/schedule.mapper';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { SchedulesDto } from './dto/create-schedule.dto';
import { RequestScheduleByHourDto } from './dto/request-schedule-by-hour.dto';
import { DateInput, format, isBefore, isEqual } from '@formkit/tempo';

@Injectable()
export class SchedulesService {

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(ScheduleByHour)
    private readonly scheduleByHourRepository: Repository<ScheduleByHour>,

    @Inject()
    private readonly doctorService: DoctorsService,

    @InjectDataSource()
    private readonly connection: DataSource
  ){}

  async create(createScheduleDto: CreateScheduleDto) {

    const newDate = new Date();
    const date = format(newDate, "YYYY-MM-DD", "en");
    
    const { schedulesDto } = createScheduleDto;
    const doctor = await this.doctorService.findOne(createScheduleDto.doctorId);

    const schedulesToSave: Schedule[] = [];
    const schedulesByHour: ScheduleByHour[] = [];
  
    for (const iterator in schedulesDto) {
      const scheduleDto = schedulesDto[iterator]
      if(scheduleDto.startTime >= scheduleDto.endTime){
        throw new BadRequestException(`endTime ${scheduleDto.endTime} must be greater than startTime ${scheduleDto.startTime}`);
      }

      if(isBefore(scheduleDto.date, date))
        throw new BadRequestException(`Date ${scheduleDto.date} must not be earlier than the current date(${date})`);
        
      const hour = Number(format(new Date(), 'HH'));
      const minute = Number(format(new Date(), 'mm'));

      if(isEqual(scheduleDto.date, date) && hour+1 === scheduleDto.startTime && minute > 30){
        throw new BadRequestException(`Hour ${scheduleDto.startTime} of current date ${scheduleDto.date} is not allow, must be at least ${hour+2}`)
      }

      if(isEqual(scheduleDto.date, date) && hour+1 > scheduleDto.startTime){
        throw new BadRequestException(`Hour ${scheduleDto.startTime} of current date ${scheduleDto.date} must not be earlier or equal than the current time(${hour})`);
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

    return {
      message: 'Schedule created successfully'
    };
  }

  async findAll(requestScheduleDto: RequestScheduleDto) {

    const schedules = await this.scheduleRepository
      .createQueryBuilder('sr')
      .leftJoinAndSelect('sr.doctor', 'srDoctor')
      .leftJoinAndSelect('srDoctor.specialities', 'specialities')
      .where(`(:doctorId is null or sr.doctor = :doctorId)`, {
        doctorId: requestScheduleDto.doctorId,
      })
      .andWhere(`(:startTime is null or sr.startTime = :startTime)`, {
        startTime: requestScheduleDto.startTime,
      })
      .andWhere(`(:date is null or sr.date = :date)`, {
        date: requestScheduleDto.date,
      })
      .andWhere('(:specialityId is null or specialities.id = :specialityId)',{
        specialityId: requestScheduleDto.specialityId,
      })
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
      .orWhere('sr.doctor.id = :doctorId AND :date = sr.date AND (:startHour >= sr.startTime AND :startHour < sr.endTime)', {
        doctorId: doctor.id,
        date: scheduleDto.date,
        startHour: scheduleDto.startTime,
      })
      .orWhere('sr.doctor.id = :doctorId AND :date = sr.date AND (:startHour <= sr.startTime AND :endHour > sr.startTime)', {
        doctorId: doctor.id,
        date: scheduleDto.date,
        startHour: scheduleDto.startTime,
        endHour: scheduleDto.endTime,
      })
      .getOne();

    return schedules;
  }

  async registerScheduleOfAppointment(doctor: Doctor, schedule: Date, startHour: number){
    
    const scheduleFound = await this.scheduleRepository.createQueryBuilder('sr')
    .leftJoinAndSelect('sr.doctor', 'doctor', 'doctor.id = :doctorId',{
      doctorId: doctor.id
    })
    .leftJoinAndSelect("sr.schedulesByHour", "scheByHour")
    .where('sr.date = :schedule', {
      schedule
    })
    .andWhere('scheByHour.startHour = :startHour AND scheByHour.isAvailable = true', {
      startHour
    })
    .getOne();

    if(!scheduleFound)
      throw new NotFoundException(`No schedule for the date ${schedule} at time ${startHour}`);

    let scheduleByHourOfAppointment =  scheduleFound.schedulesByHour.at(0);

    scheduleByHourOfAppointment.isAvailable = false;

    await this.scheduleByHourRepository.save(scheduleByHourOfAppointment);
  }

  async getSchedulesByHour(requestScheduleByHourDto: RequestScheduleByHourDto){
    const schedulesByHour = await this.scheduleByHourRepository
      .createQueryBuilder('scheByHour')
      .innerJoinAndSelect('scheByHour.schedule', 'schedule')
      .innerJoinAndSelect('schedule.doctor', 'doctor')
      .innerJoin('doctor.specialities', 'specialities')
      .where('scheByHour.isAvailable = true and schedule.date >= sysdate()')
      .andWhere('(:doctorId is null or doctor.id = :doctorId)', {
        doctorId: requestScheduleByHourDto.doctorId,
      })
      .andWhere('(:specialityId is null or specialities.id = :specialityId)', {
        specialityId: requestScheduleByHourDto.specialityId,
      })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('scheByHour.startHour', 'ASC')
      .getMany();

      return schedulesByHour.map(scheduleByHour => ScheduleMapper.responseScheduleByHour(scheduleByHour));
  }

  async getByTypeAppointment(id: number){
    const date = new Date();
    const dateFormat = format(date, "YYYY-MM-DD");
    const schedules = await this.connection.query<Schedule[]>(
      `select DISTINCT sc.date from schedules sc
      inner join doctors doc on doc.id = sc.doctorId
      inner join doctors_by_specialities docspe on docspe.doctorsId = doc.id
      inner join specialities spe on spe.id = docspe.specialitiesId
      inner join type_appointment ta on ta.specialityId = spe.id
      inner join schedule_by_hour schehour on schehour.scheduleId = sc.id
      where ta.id = ${id} and sc.date >= "${dateFormat}" and schehour.isAvailable = true`);
    return schedules.map(schedule => ScheduleMapper.transformTime(schedule));
  }

  async getHoursByDate(date: DateInput){
    const schedules = await this.connection.query(`select distinct schebyhour.startHour from schedule_by_hour schebyhour
    inner join schedules sc on sc.id = schebyhour.scheduleId
    where sc.date = "${date}" and schebyhour.isAvailable = true`);
    return schedules;
  }

  remove(id: number) {
    //TODO verify the appointments where it tries remove
  }
}
