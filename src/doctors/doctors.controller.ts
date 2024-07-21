import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { RequestPaginationDto } from 'src/common/dtos';
import { DoctorMapper } from './mapper/doctor.mapper';
import { RequestDoctorDto } from './dto/request-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll(@Query() paginationDto: RequestPaginationDto) {
    return this.doctorsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const doctor = await this.doctorsService.findOne(id);
    return DoctorMapper.doctorToDoctorDto(doctor);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Get('search/available')
  async findDoctorsAvailable(@Query() requestDoctorDto: RequestDoctorDto){
    return await this.doctorsService.findDoctorsAvailable(requestDoctorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.doctorsService.remove(id);
    return {
      message: `doctor with id ${id} deleted successfully`,
    };
  }
}
