import { EntityRepository, Repository } from 'typeorm';
import { Question } from '../../entities/many2many/Question';
import { Service } from 'typedi';

@Service()
@EntityRepository(Question)
export class QuestionRepository extends Repository<Question> {}
