import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { SpecialitiesModule } from '../specialities/specialities.module';

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService],
  imports: [
    TypeOrmModule.forFeature([ Doctor ]),
    SpecialitiesModule,
  ],
  exports: [ DoctorsService ]
})
export class DoctorsModule {}
