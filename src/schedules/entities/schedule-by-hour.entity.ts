import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Schedule } from "./schedule.entity";

@Entity()
export class ScheduleByHour{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => (Schedule),
        (schedule) => schedule.schedulesByHour,
    )
    schedule: Schedule;

    @Column('int')
    startHour: number;

    @Column('int')
    finalHour: number;

    @Column({
        type: 'boolean',
        default: true,
    })
    isAvailable: boolean;
}