import { ResponsePatientDto } from "../dto/response-patient.dto";
import { Patient } from '../entities/patient.entity';

export class PatientMapper{
    static patientToPatientDto(patient: Patient): ResponsePatientDto {
        const userDto: ResponsePatientDto = {
            id: patient.id,
            fullname: patient.fullname,
            dni: patient.dni,
            email: patient.email,
            isActive: patient.isActive
        };
        
        return userDto;
    }
}