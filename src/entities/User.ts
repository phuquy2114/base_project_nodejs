import { Roles } from '../consts/Roles';
import { Location } from './Location';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from './Comment';

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
    name: 'shop',
    nullable: false,
    length: 150
  })
  shopName: string;

  @Column({
    name: 'about',
    nullable: false,
  })
  about: string;

  @Column({
    name: 'infor_contact',
    nullable: false,
  })
  inforContact: string;

  @Column({
    name: 'phone',
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'hot_line',
    nullable: false,
  })
  hotLine: string;

  @Column({
    nullable: false
  })
  role: Roles;

  @Column({
    name: 'device_token',
  })
  deviceToken: string;

  @Column({
    name: 'avatar',
    nullable: false,
  })
  avatar: string;

  @Column({
    name: 'code',
    length: 4,
    nullable: false,
  })
  code: string;

  @OneToOne(() => Location, { cascade: true, primary: false })
  @JoinColumn()
  location: Location;

  @ManyToMany(() => Comment, { cascade: true, nullable: false })
  @JoinTable()
  comments: Comment[];

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
