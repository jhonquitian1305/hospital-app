import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateUserDto } from './dto/update-patient.dto';
import { PatientMapper } from './mapper/patient.mapper';
import { RequestPaginationDto } from 'src/common/dtos/request-pagination.dto';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-role.enum';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createUserDto: CreatePatientDto) {
    return this.patientsService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.doctor)
  async findAll(@Query() paginationDto: RequestPaginationDto) {
    return await this.patientsService.findAll(paginationDto);
  }

  @Auth(ValidRoles.patient)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.patientsService.findOne(id);
    return PatientMapper.patientToPatientDto(user);
  }

  @Patch(':id')
  @Auth(ValidRoles.patient)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.patientsService.update(id, updateUserDto);
  }

  @Auth(ValidRoles.patient)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.patientsService.remove(id);
  }
}
