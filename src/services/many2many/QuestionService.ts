import { Question } from '../../entities/many2many/Question';
import { QuestionRepository } from '../../repositories/many2many/QuestionRepository';
import { BaseService } from '../BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class QuestionService extends BaseService<Question, QuestionRepository> {
  constructor(@InjectRepository(Question) repository: QuestionRepository) {
    super(repository);
  }
}
