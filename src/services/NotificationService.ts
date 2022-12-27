
import { NotificationRepository } from '../repositories/NotificationRepository';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Notification } from '../entities/Notification';

@Service()
export class NotificationService extends BaseService<Notification, NotificationRepository> {
  constructor(@InjectRepository(Notification) repository: NotificationRepository) {
    super(repository);
  }

  getAllListNotification(): Promise<Notification[]> {
    return this.repository.getAllListVideo();
  }

}
