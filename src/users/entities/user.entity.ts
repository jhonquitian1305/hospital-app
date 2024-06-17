import { utimesSync } from "fs";
import { BeforeInsert, Column, CreateDateColumn, Entity, Long, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
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

    @Column('varchar')
    role: string;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Column()
    @CreateDateColumn({ type: 'timestamp'})
    created_at: Date;

    @BeforeInsert()
    createRoleUser(){
        this.role = 'user';
    }
}
