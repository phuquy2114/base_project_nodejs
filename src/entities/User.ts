import { Roles } from '../consts/Roles';
import { Location } from './Location';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Comment } from './Comment';
import { Notification } from './Notification';
import { Model } from '../consts/Model';

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

  @Column("text",{
    name: 'first_name',
    nullable: false,
  })
  firstName: string;

  @Column("text",{
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  @Column("text", {
    name: 'shop',
    nullable: true,
  })
  shopName: string;

  @Column({
    name: 'email',
    nullable: false,
  })
  email: string;

  // NONE = 0,
  // OTO = 1,
  // MOTO = 2,
  @Column({
    name: 'mode',
    nullable: true,
  })
  mode: Model;

  @Column("text", {
    name: 'about',
    nullable: true,
  })
  about: string;

  @Column({
    name: 'infor_contact',
    nullable: true,
  })
  inforContact: string;

  @Column({
    name: 'phone',
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'hot_line',
    nullable: true,
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
    nullable: true,
  })
  avatar: string;

  @Column({
    name: 'code',
    length: 4,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'verify',
    nullable: true,
    default: false
  })
  verifyCode: boolean;

  @OneToOne(() => Location, { cascade: true, primary: false })
  @JoinColumn()
  location: Location;

  @OneToMany(() => Comment, (commet) => commet.author)
  comments: Comment[];

  @OneToMany(() => Notification, (notifi) => notifi.author)
  notification: Notification[];

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
