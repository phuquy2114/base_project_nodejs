import { NextFunction, Request, Response } from 'express';
import { Controller, Delete, Post } from '@overnightjs/core';
import { QuestionService, CategoryService } from '../services/many2many/index';
import { Question, Category } from '../entities/many2many/index';
import { Service } from 'typedi';
import { DeleteResult } from 'typeorm';
import Log from '../utils/Log';

@Service()
@Controller('api/many2many')
export class ManyToManyController {
  private className = 'ManyToManyController';
  constructor(private readonly questionService: QuestionService, private readonly categoryService: CategoryService) {}

  @Post('insertExample')
  private async insertExample(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'insertExample', `RQ`, { req: req });

    try {
      const category1 = new Category();
      category1.name = 'animals';
      await this.categoryService.store(category1).catch((e) => {
        throw e;
      });

      const category2 = new Category();
      category2.name = 'zoo';
      await this.categoryService.store(category2).catch((e) => {
        throw e;
      });

      const question = new Question();
      question.title = 'dogs';
      question.text = 'who let the dogs out?';
      question.categories = [category1, category2];
      const newQuestion = await this.questionService.store(question).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: newQuestion });
    } catch (e) {
      next(e);
    }
  }

  @Delete('category/:id')
  private async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'deleteCategory', `RQ`, { req: req });
    
    try {
      const canetoryId: number = Number.parseInt(req.params.id, 10);
      const result: DeleteResult = await this.categoryService.delete(canetoryId).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  }
}
