import { Module, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService,
    // { 
    //   provide: APP_GUARD,
    //   useClass: UserRoleGuard,
    // }
  ],
  imports: [
    TypeOrmModule.forFeature([Patient]),
    AuthModule,
    UsersModule
  ],
  exports: [ PatientsService, ],
})
export class PatientsModule {}
