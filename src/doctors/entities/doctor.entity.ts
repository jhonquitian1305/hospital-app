import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from '../../specialities/entities/speciality.entity';

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    username: string;

    @Column({
        type: 'varchar',
        select: false,
    })
    password: string;

    @Column('varchar')
    role: string;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @ManyToMany(() => Speciality, { eager: true})
    @JoinTable({ name: 'doctors_by_specialities'})
    specialities!: Speciality[];

    @Column()
    @CreateDateColumn({ type: 'timestamp'})
    created_at: Date;

    @BeforeInsert()
    checkBeforeInsert(){
        this.role = 'doctor';
        this.username = this.username
            .toLowerCase()
            .replaceAll(' ', '');
    }

    @BeforeUpdate()
    checkBeforeUpdate(){
        this.username = this.username
            .toLowerCase()
            .replaceAll(' ', '');
    }
}
