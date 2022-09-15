import { User } from '../bo/entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class UserService extends BaseService<User, UserRepository> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }

  findByFirstName(firstName: string): Promise<User | null> {
    return this.repository.findOne({ firstName: firstName });
  }

  getCustomerUsers(): Promise<User[]> {
    return this.repository.getCustomerUsers();
  }
}
