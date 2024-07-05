import { Injectable, NotFoundException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

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