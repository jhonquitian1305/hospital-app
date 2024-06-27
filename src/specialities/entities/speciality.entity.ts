import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('specialities')
export class Speciality {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @BeforeInsert()
    saveSpeciality() {
        this.name = this.name
            .toLowerCase()
            .replaceAll(' ', '_');
    }

    @BeforeUpdate()
    updateSpeciality() {
        this.name = this.name
            .toLowerCase()
            .replaceAll(' ', '_');
    }
}
