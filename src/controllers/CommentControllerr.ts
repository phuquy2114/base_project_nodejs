import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { BaseResponse } from '../services/BaseResponse';
import { JwtInfo } from 'src/models/JwtInfo';
import { CommentReq } from '../models/CommentReq';
import { Comment } from '../entities/Comment';

@Service()
@Controller('api/comment')
export class CommentController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'CommentController';
  constructor(private readonly userService: UserService) { }

  @Get('list/:id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async listCommentId(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const result: User[] = await this.userService.getCustomerUsers().catch((e) => {
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
  private async getCommentListOfId(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const id: string = req.params.id;
      const item: User = await this.userService.findById(id, { relations: ['comments'], order: { updatedAt: 'DESC' } }).catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = item.comments;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('add')
  @Middleware([checkJwt, uploadMiddleware('file', 10)]) // 10 : file size 
  private async addComment(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addComment', `RQ`, { req: req });
    const jwtInfo = <JwtInfo>res.locals.jwtPayload;
    console.log(jwtInfo);
    try {
      const comment: CommentReq = JSON.parse(req.body.data) as CommentReq;
      const user: User = await this.userService.findById(jwtInfo.uuid).catch((e) => {
        throw e;
      });

      const shop: User = await this.userService.findById(comment.uuidShop).catch((e) => {
        throw e;
      });

      var avatar = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      console.log(avatar);

      const cm = new Comment();
      cm.comment = comment.comment;
      cm.rate = comment.rate;
      cm.fileImage = avatar;
      cm.author = user;

      await cm.save();

      shop.comments = [cm];

      await shop.save();

      this.dataResponse.status = 200;
      this.dataResponse.data = {};
      this.dataResponse.message = 'Comment Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Delete('delete/:shopId/comment/:commentId')
  @Middleware([checkJwt])
  private async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });
    const jwtInfo = <JwtInfo>res.locals.jwtPayload;
    try {
      const uuidShop: number = Number.parseInt(req.params.shopId, 0);
      const commentID: number = Number.parseInt(req.params.commentId, 0);

      console.log(uuidShop);
      console.log(commentID);

      const shop: User | undefined = await this.userService.findById(uuidShop, { relations: ['comments'] }).catch((err) => {
        throw err;
      });

      shop.comments = shop.comments.filter(cm => {
        return cm.uuid !== commentID;
      });

      await shop.save();

      this.dataResponse.status = 200;
      this.dataResponse.data = {};
      this.dataResponse.message = 'Commemt deleted - the successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Put('update/:shopId/comment/:commentId')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {

      const comment: CommentReq = req.body;

      const uuidShop: number = Number.parseInt(req.params.shopId, 0);
      const commentID: number = Number.parseInt(req.params.commentId, 0);


      const shop: User | undefined = await this.userService.findById(uuidShop, { relations: ['comments'] }).catch((err) => {
        throw err;
      });

      const cm = shop.comments.find(x => x.uuid === commentID) as Comment;
      cm.comment = comment.comment;
      cm.rate = comment.rate;
      
      await cm.save();
     
  

      this.dataResponse.status = 200;
      this.dataResponse.data = {};
      this.dataResponse.message = 'Updated Comment successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }
}
