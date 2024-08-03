import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RequestAppointmentDto } from './dto/request-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators';
import { Patient } from 'src/patients/entities/patient.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { RequestPaginationDto } from '../common/dtos/request-pagination.dto';
import { Doctor } from '../doctors/entities/doctor.entity';

@Controller('appointments')
@Auth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Auth(ValidRoles.patient)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @GetUser() patient: Patient
  ) {
    await this.appointmentsService.create(createAppointmentDto, patient);
    return {
      message: 'The appointment has been successfully created'
    };
  }

  @Get()
  findAll(@Query() requestAppointmentDto: RequestAppointmentDto) {
    return this.appointmentsService.findAll(requestAppointmentDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number){
    return this.appointmentsService.findOneById(id);
  }

  @Patch(':id')
  async registerAppointmentCompleted(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto){
    await this.appointmentsService.registerAppointmentCompleted(id, updateAppointmentDto);
  }

  @Get('my-appointments/by-patient')
  @Auth(ValidRoles.patient)
  getByPatient(
    @GetUser() patient: Patient,
    @Query() requestPaginationDto: RequestPaginationDto,
  ){
    return this.appointmentsService.getByPatient(patient, requestPaginationDto);
  }

  @Get('my-appointments/by-doctor')
  @Auth(ValidRoles.doctor)
  getByDoctor(
    @GetUser() doctor: Doctor,
    @Query() requestPaginationDto: RequestPaginationDto,
  ){
    return this.appointmentsService.getByDoctor(doctor, requestPaginationDto);
  }
}
