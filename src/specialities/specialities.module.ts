import { Module } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from './entities/speciality.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
  imports: [
    TypeOrmModule.forFeature([ Speciality ]),
    AuthModule,
  ],
  exports: [ SpecialitiesService],
})
export class SpecialitiesModule {}
