import { Roles } from '../../consts/Roles';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
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
