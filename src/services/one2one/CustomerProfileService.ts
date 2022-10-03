import { CustomerProfile } from '../../entities/one2one/CustomerProfile';
import { CustomerProfileRepository } from '../../repositories/one2one/CustomerProfileRepository';
import { BaseService } from '../BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class CustomerProfileService extends BaseService<CustomerProfile, CustomerProfileRepository> {
  constructor(@InjectRepository(CustomerProfile) repository: CustomerProfileRepository) {
    super(repository);
  }
}
