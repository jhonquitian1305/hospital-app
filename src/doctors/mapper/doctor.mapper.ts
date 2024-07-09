import { ResponseDoctorDto } from "../dto/response-doctor.dto";
import { Doctor } from "../entities/doctor.entity";

export class DoctorMapper{
    static doctorToDoctorDto(doctor: Doctor): ResponseDoctorDto {
        const doctorDto: ResponseDoctorDto = {
            id: doctor.id,
            fullname: doctor.fullname,
            dni: doctor.dni,
            email: doctor.email,
            isActive: doctor.isActive,
            specialities: doctor.specialities
        };
        return doctorDto;
    }

}