import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'customer_profile' })
export class CustomerProfile extends BaseEntity {
  @PrimaryColumn({
    length: 150
  })
  email: string;

  @Column()
  address: string;

  @Column()
  favourite: string;
}
