import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity('notification')
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid: Number;

    // 1 link 
    // 2 ca nhan giao dich 
    // 3 nhan cuoc giao dich sua chuan 
    @Column()
    type: number;

    @ManyToOne(() => User, user => user.notification)
    author: User;

    @Column("text")
    title: string;

    @Column("text")
    body: string;

    @Column("text")
    attribute: string;

    @CreateDateColumn({
        name: 'created_at',
        nullable: false
    })
    createdAt: string;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: false
    })
    updatedAt: string;
}
