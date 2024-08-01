import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypeAppointmentsService } from './type_appointments.service';
import { CreateTypeAppointmentDto } from './dto/create-type_appointment.dto';
import { UpdateTypeAppointmentDto } from './dto/update-type_appointment.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('type-appointments')
@Auth(ValidRoles.doctor)
export class TypeAppointmentsController {
  constructor(private readonly typeAppointmentsService: TypeAppointmentsService) {}

  @Post()
  create(@Body() createTypeAppointmentDto: CreateTypeAppointmentDto) {
    return this.typeAppointmentsService.create(createTypeAppointmentDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.typeAppointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeAppointmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeAppointmentDto: UpdateTypeAppointmentDto) {
    return this.typeAppointmentsService.update(+id, updateTypeAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeAppointmentsService.remove(+id);
  }
}
