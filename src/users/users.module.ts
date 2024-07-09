import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [ TypeOrmModule.forFeature([ User, Role, ])],
  exports: [ UsersService ]
})
export class UsersModule {}
