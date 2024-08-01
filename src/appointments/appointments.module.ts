import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { State } from './entities/state.entity';
import { PatientsModule } from './../patients/patients.module';
import { DoctorsModule } from './../doctors/doctors.module';
import { TypeAppointmentsModule } from './../type_appointments/type_appointments.module';
import { SchedulesModule } from 'src/schedules/schedules.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  imports: [
    TypeOrmModule.forFeature([ Appointment, State ]),
    PatientsModule,
    DoctorsModule,
    TypeAppointmentsModule,
    SchedulesModule,
    AuthModule,
  ],
})
export class AppointmentsModule {}
