import { BaseEntity, DeleteResult, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { IBaseService } from './IBaseService';
import { EntityId } from 'typeorm/repository/EntityId';
import { Service } from 'typedi';

@Service()
export class BaseService<T extends BaseEntity, R extends Repository<T>> implements IBaseService<T> {
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  async index(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findById(id: EntityId, options?: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(id, options);
  }

  async findByIds(ids: [EntityId], options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.findByIds(ids, options);
  }

  // eslint-disable-next-line
  async store(data: any): Promise<T> {
    return await this.repository.save(data);
  }

  // eslint-disable-next-line
  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return await this.findById(id);
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}
