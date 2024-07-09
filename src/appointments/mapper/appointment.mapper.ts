import { Appointment } from "../entities/appointment.entity";
import { format } from '@formkit/tempo';

export class AppointmentMapper {
    static appointmentToAppointmentDto(appointment: Appointment){
        const appointmentDto: ResponseAppointmentDto = {
            id: appointment.id,
            description: appointment.description,
            schedule: appointment.schedule,
            startHour: appointment.startHour,
            completed_at: format(appointment.completed_at, "YYYY-MM-DD HH:mm:ss"),
            patient: {
                id: appointment.patient.id,
                fullname: appointment.patient.fullname,
                dni: appointment.patient.dni,
                email: appointment.patient.email,
            },
            doctor: {
                id: appointment.doctor.id,
                name: appointment.doctor.fullname,
                username: appointment.doctor.fullname,
            },
            type: {
                id: appointment.type.id,
                name: appointment.type.name,
            },
            state: {
                id: appointment.state.id,
                name: appointment.state.name,
            }
        }

        return appointmentDto;
    }
}