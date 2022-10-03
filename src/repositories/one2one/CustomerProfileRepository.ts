import { EntityRepository, Repository } from 'typeorm';
import { CustomerProfile } from '../../entities/one2one/CustomerProfile';
import { Service } from 'typedi';

@Service()
@EntityRepository(CustomerProfile)
export class CustomerProfileRepository extends Repository<CustomerProfile> {}
