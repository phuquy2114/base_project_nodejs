import { User } from '../entities/User';
import { NewsArticleRepository } from '../repositories/NewsArticleRepository';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { NewsArticles } from '../entities/NewsArticles';

@Service()
export class ArticlesService extends BaseService<NewsArticles, NewsArticleRepository> {
  constructor(@InjectRepository(NewsArticles) repository: NewsArticleRepository) {
    super(repository);
  }

  getAllListVideo(): Promise<NewsArticles[]> {
    return this.repository.getAllListVideo();
  }


  getAllListLink(): Promise<NewsArticles[]> {
    return this.repository.getAllListLink();
  }

}
