import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { State } from './entities/state.entity';
import { UsersModule } from 'src/users/users.module';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { TypeAppointmentsModule } from 'src/type_appointments/type_appointments.module';
import { SchedulesModule } from 'src/schedules/schedules.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [
    TypeOrmModule.forFeature([ Appointment, State ]),
    UsersModule,
    DoctorsModule,
    TypeAppointmentsModule,
    SchedulesModule,
  ],
})
export class AppointmentsModule {}
