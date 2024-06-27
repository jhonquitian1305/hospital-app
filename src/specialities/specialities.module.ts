import { Module } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from './entities/speciality.entity';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
  imports: [
    TypeOrmModule.forFeature([ Speciality ]),
  ],
  exports: [ SpecialitiesService],
})
export class SpecialitiesModule {}
