import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { NewsArticles } from '../entities/NewsArticles';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import { Geometry, Point } from 'geojson';

@Service()
@EntityRepository(NewsArticles)
export class NewsArticleRepository extends Repository<NewsArticles> {

  getAllListVideo(): Promise<NewsArticles[]> {
    return this.createQueryBuilder('type')
      .where('type = :type', { type: "1" })
      .getMany();
  }

  getAllListLink(): Promise<NewsArticles[]> {
    return this.createQueryBuilder('type')
      .where('type = :type', { type: "2" })
      .getMany();
  }

}
