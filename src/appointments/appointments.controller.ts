import { Controller, Get, Post, Body, Patch, Param, Query, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RequestAppointmentDto } from './dto/request-appointment.dto';

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
  findAll(@Query() requestAppointmentDto: RequestAppointmentDto) {
    return this.appointmentsService.findAll(requestAppointmentDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number){
    return this.appointmentsService.findOneById(id);
  }
}
