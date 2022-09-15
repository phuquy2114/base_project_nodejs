import { EntityId } from 'typeorm/repository/EntityId';
import { DeleteResult, FindManyOptions, FindOneOptions } from 'typeorm';

export interface IBaseService<T> {
  index(options?: FindManyOptions<T>): Promise<T[]>;

  findById(id: EntityId, options?: FindOneOptions<T>): Promise<T>;

  findByIds(id: [EntityId], options?: FindManyOptions<T>): Promise<T[]>;

  // eslint-disable-next-line
  store(data: any): Promise<T>;

  // eslint-disable-next-line
  update(id: EntityId, data: any): Promise<T>;

  delete(id: EntityId): Promise<DeleteResult>;
}
