import { Appointment } from "../entities/appointment.entity";

export class AppointmentMapper {
    static appointmentToAppointmentDto(appointment: Appointment){
        const appointmentDto: ResponseAppointmentDto = {
            id: appointment.id,
            description: appointment.description,
            schedule: appointment.schedule,
            startHour: appointment.startHour,
            completed_at: appointment.completed_at,
            user: {
                id: appointment.user.id,
                fullname: appointment.user.fullname,
                dni: appointment.user.dni,
                email: appointment.user.email,
            },
            doctor: {
                id: appointment.doctor.id,
                name: appointment.doctor.name,
                username: appointment.doctor.name,
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