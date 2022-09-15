import { EntityRepository, Repository } from 'typeorm';
import { User } from '../bo/entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getCustomerUsers(): Promise<User[]> {
    return this.createQueryBuilder().where('role = :role', { role: Roles.CUSTOMER }).getMany();
  }
}
