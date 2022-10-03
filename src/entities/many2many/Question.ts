import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, BaseEntity } from 'typeorm';
import { Category } from './Category';

@Entity({ name: 'question' })
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'category_question',
    joinColumns: [
      {
        name: 'question_id',
        referencedColumnName: 'id'
      }
    ],
    inverseJoinColumns: [
      {
        name: 'category_id',
        referencedColumnName: 'id'
      }
    ]
  })
  categories: Category[];
}
