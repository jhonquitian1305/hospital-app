import { Speciality } from "src/specialities/entities/speciality.entity";

export class ResponseDoctorDto {
    id?: number;
    fullname: string;
    dni: string;
    email: string;
    isActive?: boolean;
    specialities: Speciality[];
}