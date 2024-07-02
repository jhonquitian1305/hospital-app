import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('states')
export class State {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;
}