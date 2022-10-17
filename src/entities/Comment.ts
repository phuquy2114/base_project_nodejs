import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User";

@Entity('comments')
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    uuid: Number;

    @Column()
    rate: number;

    @Column({
        nullable: false
    })
    fileImage: string;

    @Column()
    comment: string;

    @ManyToOne(() => User, { cascade: true, primary: false })
    @JoinColumn({ name: "user_id" })
    userComment: User;

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
