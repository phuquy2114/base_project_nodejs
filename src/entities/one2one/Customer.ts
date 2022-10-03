import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CustomerProfile } from './CustomerProfile';

@Entity({ name: 'customer' })
export class Customer extends BaseEntity {
  @PrimaryColumn({
    length: 150
  })
  email: string;

  @Column({
    name: 'fullname',
    nullable: false,
    length: 150
  })
  fullname: string;

  @OneToOne(() => CustomerProfile, { cascade: true, primary: true })
  @JoinColumn({ name: 'email' })
  profile: CustomerProfile;
}
