import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateUserDto } from './dto/update-patient.dto';
import { PatientMapper } from './mapper/patient.mapper';
import { RequestPaginationDto } from 'src/common/dtos/request-pagination.dto';
import { Patient } from './entities/patient.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth, GetUser } from '../auth/decorators';

@Controller('users')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createUserDto: CreatePatientDto) {
    return this.patientsService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.doctor, ValidRoles.user)
  async findAll(@Query() paginationDto: RequestPaginationDto, @GetUser() user: Patient) {
    console.log(user);
    return await this.patientsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.patientsService.findOne(id);
    return PatientMapper.patientToPatientDto(user);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.patientsService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
