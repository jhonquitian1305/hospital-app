import { Speciality } from "src/specialities/entities/speciality.entity";

export class ResponseDoctorDto {
    id: number;
    name: string;
    username: string;
    role: string;
    specialities: Speciality[];
}