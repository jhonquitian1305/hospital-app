import { ResponseDoctorDto } from "../dto/response-doctor.dto";
import { Doctor } from "../entities/doctor.entity";

export class DoctorMapper{
    static doctorToDoctorDto(doctor: Doctor): ResponseDoctorDto {
        const doctorDto: ResponseDoctorDto = {
            id: doctor.id,
            name: doctor.name,
            username: doctor.username,
            role: doctor.role
        };
        return doctorDto;
    }

}