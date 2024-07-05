import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { TypeAppointment } from "../../type_appointments/entities/type_appointment.entity";
import { State } from "./state.entity";

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Patient, { eager: true })
    patient: Patient;

    @ManyToOne(() => Doctor, { eager: true })
    doctor: Doctor;

    @Column({
       type: 'varchar',
       nullable: true,
    })
    description?: string;

    @Column('date')
    schedule: Date;

    @Column('int')
    startHour: number;

    @ManyToOne(() => TypeAppointment, { eager: true })
    type: TypeAppointment;

    @ManyToOne(() => State, { eager: true })
    state: State;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    completed_at?: string;
}
