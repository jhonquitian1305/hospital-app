import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Repository } from "typeorm";
import { Patient } from '../../patients/entities/patient.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(Patient)
        private readonly usersRepository: Repository<Patient>,

        @InjectRepository(Doctor)
        private readonly doctorsRepository: Repository<Doctor>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload){
        const user = this.usersRepository.findOneBy({ id: payload.id});

        if(user)
            return user;

        const doctor = this.doctorsRepository.findOneBy({ id: payload.id});

        if(!doctor)
            throw new NotFoundException('Token not valid');

        return doctor;
    }
}