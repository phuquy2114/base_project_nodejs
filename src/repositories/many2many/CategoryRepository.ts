import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../../entities/many2many/Category';
import { Service } from 'typedi';

@Service()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}
