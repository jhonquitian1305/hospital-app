import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { TypeAppointment } from "../../type_appointments/entities/type_appointment.entity";
import { State } from "./state.entity";

@Entity('appointments')
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Doctor)
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

    @ManyToOne(() => TypeAppointment)
    type: TypeAppointment;

    @ManyToOne(() => State)
    state: State;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    completed_at?: Date;
}
