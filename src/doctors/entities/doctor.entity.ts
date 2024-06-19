import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
