import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { State } from './entities/state.entity';
import { StatesEnum } from './dto/state.enum';

@Injectable()
export class AppointmentsService {

  private readonly logger = new Logger('AppointmentsService');

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    @InjectRepository(State)
    private readonly statesRepository: Repository<State>,

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

  async findAll() {
    return await this.appointmentRepository.findBy({ state: { id : StatesEnum.CREADA}});
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
