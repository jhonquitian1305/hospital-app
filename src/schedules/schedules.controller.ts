import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { RequestScheduleDto } from './dto/request-schedule.dto';
import { RequestScheduleByHourDto } from './dto/request-schedule-by-hour.dto';
import { DateInput } from '@formkit/tempo';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from '../auth/decorators/auth.decorator';
import { Doctor } from '../doctors/entities/doctor.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('schedules')
@Auth()
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @Auth(ValidRoles.doctor)
  create(
    @Body() createScheduleDto: CreateScheduleDto,
    @GetUser() doctor: Doctor,
  ) {
    return this.schedulesService.create(createScheduleDto, doctor);
  }

  @Get()
  findAll(@Query() requestScheduleDto: RequestScheduleDto) {
    return this.schedulesService.findAll(requestScheduleDto);
  }

  @Get('schedules-by-hour')
  findSchedulesByHour(@Query() requestScheduleByHourDto: RequestScheduleByHourDto){
    return this.schedulesService.getSchedulesByHour(requestScheduleByHourDto);
  }

  @Get('only-schedules')
  async getSchedulesByTypeAppointment(@Query('typeId', ParseIntPipe) typeId: number){
    return await this.schedulesService.getByTypeAppointment(typeId);
  }

  @Get('hours-allow')
  async getHoursByDate(@Query('date') date: DateInput){
    return await this.schedulesService.getHoursByDate(date);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
