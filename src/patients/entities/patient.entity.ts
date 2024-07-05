import { BeforeInsert, Column, CreateDateColumn, Entity, Long, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('patients')
export class Patient {

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
