import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { Schedule, ScheduleByHour } from './entities';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [
    TypeOrmModule.forFeature([ Schedule, ScheduleByHour ]),
    DoctorsModule,
  ],
  exports: [ SchedulesService, ],
})
export class SchedulesModule {}
