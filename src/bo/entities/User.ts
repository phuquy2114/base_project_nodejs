import { Roles } from '../../consts/Roles';
import {Location} from '../entities/Location';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  uuid: number
  
  @Column({
    length: 150
  })
  usr: string;

  @Exclude()
  @Column({
    nullable: false,
    length: 150,
  })
  pwd: string;

  @Column({
    name: 'first_name',
    nullable: false,
    length: 150
  })
  firstName: string;

  @Column({
    name: 'last_name',
    nullable: false,
    length: 150
  })
  lastName: string;

  @Column({
    nullable: false
  })
  role: Roles;

  @Column({
    name: 'device_token',
  })
  deviceToken: string; 

  @Column({
    name: 'phone',
  })
  phone: string;

  @Column({
    name: 'avatar',
    nullable: false,
  })
  avatar: string; 

  @Column({
    name: 'code',
    length : 4,
    nullable: false,
  })
  code: string;

  @OneToOne(() => Location , { cascade: true, primary: false })
  @JoinColumn()
  location: Location; 

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

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
