import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SpecialitiesModule } from './specialities/specialities.module';
import { TypeAppointmentsModule } from './type_appointments/type_appointments.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      timezone: "-05:00"
    }),
    CommonModule,
    PatientsModule,
    DoctorsModule,
    SchedulesModule,
    SpecialitiesModule,
    TypeAppointmentsModule,
    AppointmentsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
