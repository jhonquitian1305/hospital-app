import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('specialities')
@Auth(ValidRoles.doctor)
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Post()
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialitiesService.create(createSpecialityDto);
  }

  @Get()
  findAll() {
    return this.specialitiesService.findAll();
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSpecialityDto: UpdateSpecialityDto) {
    return this.specialitiesService.update(id, updateSpecialityDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.specialitiesService.remove(id);
  }
}
