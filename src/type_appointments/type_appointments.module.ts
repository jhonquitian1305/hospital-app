import { Module } from '@nestjs/common';
import { TypeAppointmentsService } from './type_appointments.service';
import { TypeAppointmentsController } from './type_appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeAppointment } from './entities/type_appointment.entity';
import { SpecialitiesModule } from 'src/specialities/specialities.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TypeAppointmentsController],
  providers: [TypeAppointmentsService],
  imports: [
    TypeOrmModule.forFeature([ TypeAppointment ]),
    SpecialitiesModule,
    AuthModule,
  ],
  exports: [ TypeAppointmentsService, ],
})
export class TypeAppointmentsModule {}
