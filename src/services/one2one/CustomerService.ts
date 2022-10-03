import { Customer } from '../../entities/one2one/Customer';
import { CustomerRepository } from '../../repositories/one2one/CustomerRepository';
import { BaseService } from '../BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class CustomerService extends BaseService<Customer, CustomerRepository> {
  constructor(@InjectRepository(Customer) repository: CustomerRepository) {
    super(repository);
  }
}
