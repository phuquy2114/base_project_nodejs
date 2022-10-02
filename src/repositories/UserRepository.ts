import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { User } from '../bo/entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  getCustomerUsers(): Promise<User[]> {
    return this.createQueryBuilder('q')
      .leftJoinAndSelect("q.location", "location")
      .where('role = :role', { role: Roles.CORPORATE })
      .getMany();
  }

  getByUsername(usr: string): Promise<User> {
    return this.createQueryBuilder('q')
      .leftJoinAndSelect("q.location", "location")
      .where('usr = :usr', { usr: usr }).getOne();
  }

  updateUser(usr: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(User)
      .set({
        
      })
      .where('usr = :usr', { usr: usr }).execute();
  }
}
