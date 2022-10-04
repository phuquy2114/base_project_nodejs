import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm"

@Entity()
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
