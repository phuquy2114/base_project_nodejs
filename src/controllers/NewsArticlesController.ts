import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { BaseResponse } from '../services/BaseResponse';
import { NewsArticles } from '../entities/NewsArticles';
import { ArticlesService } from '../services/NewsArticleService';

@Service()
@Controller('api/news_articles')
export class NewsArticlesController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'NewsArticlesController';
  constructor(private readonly articlesService: ArticlesService) { }

  @Get('list_video')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async listVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const result: NewsArticles[] = await this.articlesService.getAllListVideo().catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = result;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  
  @Get('list_link')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async listLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const result: NewsArticles[] = await this.articlesService.getAllListLink().catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = result;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Get(':id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const id: string = req.params.id;
      const item: NewsArticles = await this.articlesService.findById(id).catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = item;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('add/video')
  @Middleware([uploadMiddleware('file', 100)]) // 10 : file size 
  private async addVideo(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {

      const news: NewsArticles = JSON.parse(req.body.jsonData) as NewsArticles;

      var videoLink = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      news.pathVideo = videoLink.toString();

      console.log(videoLink);

      const newNewsArticles: NewsArticles = await this.articlesService.store(news).catch((e) => {
        throw e;
      });


      this.dataResponse.status = 200;
      this.dataResponse.data = newNewsArticles;
      this.dataResponse.message = 'Register Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('add/link')
  @Middleware([uploadMiddleware('file', 10)]) // 10 : file size 
  private async addLink(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {

      const news: NewsArticles = JSON.parse(req.body.jsonData) as NewsArticles;

      var imageFile = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      news.pathImage = imageFile.toString();

      console.log(imageFile);

      const newNewsArticles: NewsArticles = await this.articlesService.store(news).catch((e) => {
        throw e;
      });


      this.dataResponse.status = 200;
      this.dataResponse.data = newNewsArticles;
      this.dataResponse.message = 'Register Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }


  @Put('update')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {
      console.log(req.body.firstName);
      console.log(req.body.lastName);
      console.log(req.body.avatar);
      console.log(req.body.phone);
      const news: NewsArticles = JSON.parse(req.body.jsonData) as NewsArticles;
      const newNewsArticles: NewsArticles = await this.articlesService.update(news.uuid, news).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: newNewsArticles });
    } catch (e) {
      next(e);
    }
  }
}
