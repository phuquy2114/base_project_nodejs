import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'news_articles' })
export class NewsArticles extends BaseEntity {

    @PrimaryGeneratedColumn()
    uuid: number

    @Column("text", {
        name: 'title',
        nullable: false,
    })
    title: string;

    // 1 : video , 2 : link content webview 
    @Column({
        name: 'type',
        nullable: false,
    })
    type: string;

    @Column("text", {
        name: 'description',
        nullable: false,
    })
    description: string;

    @Column("text", {
        name: 'ckEditor',
        nullable: true,
    })
    ckEditor: string;

    @Column({
        name: 'path_image',
        nullable: true,
    })
    pathImage: string;

    @Column({
        name: 'path_video',
        nullable: true,
    })
    pathVideo: string;

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