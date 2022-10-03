import { NextFunction, Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { CustomerProfileService, CustomerService } from '../services/one2one/index';
import { CustomerProfile, Customer } from '../entities/one2one/index';
import { Service } from 'typedi';
import Log from '../utils/Log';

@Service()
@Controller('api/one2one')
export class OneToOneController {
  private className = 'OneToOneController';
  constructor(private readonly customerProfileService: CustomerProfileService, private readonly customerService: CustomerService) {}

  @Post('insertExample')
  private async insertExample(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'insertExample', `RQ`, { req: req });
    
    try {
      let profile = new CustomerProfile();
      profile.email = 'thanhdh@mail.com';
      profile.address = 'Da nang';
      profile.favourite = 'Football';
      profile = await this.customerProfileService.store(profile).catch((e) => {
        throw e;
      });

      const customer = new Customer();
      customer.email = 'thanhdh@mail.com';
      customer.fullname = 'Doan Ha Thanh';
      customer.profile = profile;
      await this.customerService.store(customer).catch((e) => {
        throw e;
      });

      const newCustomer: Customer = await this.customerService.findById('thanhdh@mail.com', { relations: ['profile'] });

      res.status(200).json({ data: newCustomer });
    } catch (e) {
      next(e);
    }
  }
}
