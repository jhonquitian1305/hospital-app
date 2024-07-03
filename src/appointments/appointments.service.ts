import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { TypeAppointmentsService } from 'src/type_appointments/type_appointments.service';
import { SchedulesService } from 'src/schedules/schedules.service';
import { HandleError } from 'src/common/handle-errors/handle-errors';
import { StatesEnum } from './dto/state.enum';
import { RequestAppointmentDto } from './dto/request-appointment.dto';
import { ResponsePaginatedDto } from 'src/common/dtos';
import { AppointmentMapper } from './mapper/appointment.mapper';

@Injectable()
export class AppointmentsService {

  private readonly logger = new Logger('AppointmentsService');

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @Inject()
    private readonly usersService: UsersService,

    @Inject()
    private readonly doctorsService: DoctorsService,

    @Inject()
    private readonly typeAppointmentService: TypeAppointmentsService,

    @Inject()
    private readonly schedulesService: SchedulesService,

    @Inject()
    private readonly dataSource: DataSource,
  ){}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const { userId, doctorId, typeId, ...appointmentData } = createAppointmentDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.usersService.findOne(userId);

    const typeAppointment = await this.typeAppointmentService.findOne(typeId);

    const doctor = await this.doctorsService.findOneByIdAndSpeciality(doctorId, typeAppointment.speciality);

    await this.schedulesService.registerScheduleOfAppointment(doctor, createAppointmentDto.schedule, createAppointmentDto.startHour);

    try {
      const appointment = this.appointmentRepository.create({
        ...appointmentData,
        user,
        doctor,
        type: typeAppointment,
        state: { id: StatesEnum.CREADA}
      });      
      
      await queryRunner.manager.save(appointment);
      await queryRunner.commitTransaction();
      await queryRunner.release();

    } catch (error) {

      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.logger.error(error);
      HandleError.handleDBErrors(error);
    }    
  }

  async findAll(requestAppointmentDto: RequestAppointmentDto) {
    const appointments = await this.appointmentRepository
    .createQueryBuilder('ar')
    .innerJoinAndSelect('ar.user', 'user')
    .innerJoinAndSelect('ar.doctor', 'doctor')
    .innerJoinAndSelect('ar.type', 'type')
    .innerJoinAndSelect('ar.state', 'state')
    .where('(:startHour is null OR ar.startHour = :startHour) AND (:schedule is null OR ar.schedule = :schedule)', {
      startHour: requestAppointmentDto.startHour,
      schedule: requestAppointmentDto.date,
    })
    .andWhere('(:userDni is null OR user.dni = :userDni)', {
      userDni: requestAppointmentDto.userDni,
    })
    .andWhere('(:doctorId is null OR doctor.id = :doctorId)', {
      doctorId: requestAppointmentDto.doctorId,
    })
    .andWhere('(:typeId is null OR type.id = :typeId)', {
      typeId: requestAppointmentDto.typeAppointmentId,
    })
    .andWhere('(:stateId is null OR state.id = :stateId)', {
      stateId: requestAppointmentDto.stateId,
    })
    .limit(requestAppointmentDto.limit)
    .offset(requestAppointmentDto.offset)
    .getManyAndCount();

    const responseAppointmentDto: ResponsePaginatedDto<ResponseAppointmentDto> = {
      elements: appointments[0].map(appointment => AppointmentMapper.appointmentToAppointmentDto(appointment)),
      totalElements: appointments[1],
      limit: requestAppointmentDto.limit,
      offset: requestAppointmentDto.offset,
    }
    
    return responseAppointmentDto;
  }

  async findOneById(id: number) {
    const appointment = await this.appointmentRepository.findOneBy({ id });

    if(!appointment)
      throw new NotFoundException(`Appointment with id ${id} not found`);

    return AppointmentMapper.appointmentToAppointmentDto(appointment);
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
