import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Speciality } from '../../specialities/entities/speciality.entity';

@Entity()
export class TypeAppointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @Column('double')
    price: number;

    @ManyToOne(
        () => Speciality,
        { eager: true },
    )
    speciality: Speciality;

    @Column({
        type: 'boolean',
        default: true,
    })
    isAvailable: boolean;

    @BeforeInsert()
    beforeInsertName(){
        this.name = this.name
                .toLowerCase()
                .replaceAll(' ', '_');
    }

    @BeforeUpdate()
    beforeUpdateName(){
        this.name = this.name
                .toLowerCase()
                .replaceAll(' ', '_');
    }
}
