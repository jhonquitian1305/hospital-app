import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Doctor } from "../../doctors/entities/doctor.entity";
import { ScheduleByHour } from "./schedule-by-hour.entity";

@Entity('schedules')
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => (Doctor),
        (doctor) => doctor.id,
        { eager: true }
    )
    doctor: Doctor;

    @Column('date')
    date: Date;

    @Column('int')
    startTime: number;

    @Column('int')
    endTime: number;

    @Column({
        type: 'boolean',
        default: true,
    })
    onDuty: boolean;

    @OneToMany(
        () => ScheduleByHour,
        (scheduleByHour) => scheduleByHour.schedule,
        { cascade: true, }
    )
    schedulesByHour: ScheduleByHour[];
}
