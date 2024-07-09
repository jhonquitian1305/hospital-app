import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Speciality } from '../../specialities/entities/speciality.entity';

@Entity('doctors')
export class Doctor {
    @PrimaryColumn()
    id: number;

    @Column('text')
    fullname: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    dni: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        select: false,
    })
    password: string;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Column()
    @CreateDateColumn({ type: 'timestamp'})
    created_at: Date;

    @ManyToMany(() => Speciality, { eager: true})
    @JoinTable({ name: 'doctors_by_specialities'})
    specialities!: Speciality[];
}
