import { Roles } from '../../consts/Roles';
import {Location} from '../entities/Location';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryColumn({
    length: 150
  })
  usr: string;

  @Exclude()
  @Column({
    nullable: false,
    length: 150
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
    nullable: true,
  })
  avatar: string; 

  @Column({
    name: 'address',
    nullable: false,
    length: 150
  })
  address: string; 

  @OneToOne(() => Location)
  @JoinColumn({name : 'location'})
  location: Location; 

  @Column({
    name: 'code',
    length : 4
  })
  code: string;

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
