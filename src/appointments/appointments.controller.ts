import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    await this.appointmentsService.create(createAppointmentDto);
    return {
      'message': 'The appointment has been successfully created'
    };
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }
}
