import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { RequestScheduleDto } from './dto/request-schedule.dto';
import { RequestScheduleByHourDto } from './dto/request-schedule-by-hour.dto';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll(@Query() requestScheduleDto: RequestScheduleDto) {
    return this.schedulesService.findAll(requestScheduleDto);
  }

  @Get('schedules-by-hour')
  findSchedulesByHour(@Query() requestScheduleByHourDto: RequestScheduleByHourDto){
    return this.schedulesService.getSchedulesByHour(requestScheduleByHourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schedulesService.remove(+id);
  }
}
