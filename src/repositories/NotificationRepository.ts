import { EntityRepository, Repository } from 'typeorm';
import { Notification } from '../entities/Notification';
import { Service } from 'typedi';

@Service()
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {

  getAllListVideo(): Promise<Notification[]> {
    return this.createQueryBuilder('type')
      .where('type = :type', { type: "1" })
      .getMany();
  }

  getAllListAll(): Promise<Notification[]> {
    return this.createQueryBuilder()
      .getMany();
  }
}
