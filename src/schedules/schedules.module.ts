import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsModule } from '../doctors/doctors.module';
import { Schedule, ScheduleByHour } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SchedulesController],
  providers: [SchedulesService],
  imports: [
    TypeOrmModule.forFeature([ Schedule, ScheduleByHour ]),
    DoctorsModule,
    AuthModule,
  ],
  exports: [ SchedulesService, ],
})
export class SchedulesModule {}
