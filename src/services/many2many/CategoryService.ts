import { Category } from '../../entities/many2many/Category';
import { CategoryRepository } from '../../repositories/many2many/CategoryRepository';
import { BaseService } from '../BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class CategoryService extends BaseService<Category, CategoryRepository> {
  constructor(@InjectRepository(Category) repository: CategoryRepository) {
    super(repository);
  }
}
