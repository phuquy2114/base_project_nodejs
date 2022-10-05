import { BaseEntity, Column, CreateDateColumn, Double, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'location' })
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  uuid: number

  @Column({
    name: 'lat',
    type: 'decimal',
    nullable: true,
  })
  lat: number;

  @Column({
    name: 'log',
    type: 'decimal',
    nullable: true,
  })
  log: number;

  @Column({
    name: 'address',
    nullable: false,
    length: 150
  })
  address: string;

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

  constructor(partial: Partial<Location>) {
    super();
    Object.assign(this, partial);
  }
}
