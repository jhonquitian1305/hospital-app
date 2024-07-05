import { User } from './../users/entities/user.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../doctors/entities/doctor.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ],
  imports: [
    TypeOrmModule.forFeature([ User, Doctor ]),
    PassportModule.register({ 'defaultStrategy': 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '1h',
          },
        }
      }
    })
  ],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy
  ]
})
export class AuthModule {}
