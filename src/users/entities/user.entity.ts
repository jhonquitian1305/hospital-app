import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

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

    @ManyToOne(
        () => Role,
        { eager: true }
    )
    role: Role;

    @Column({
        type: 'boolean',
        default: true
    })
    isActive: boolean;

    @Column()
    @CreateDateColumn({ type: 'timestamp'})
    created_at: Date;
}
