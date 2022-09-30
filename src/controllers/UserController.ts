import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { UserService } from '../services/UserService';
import { User } from '../bo/entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { BaseResponse } from '../services/BaseResponse';

@Service()
@Controller('api/user')
export class UserController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'UserController';
  constructor(private readonly userService: UserService) { }

  @Get('list')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async listUser(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  private async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const username: string = req.params.id;
      const item: User = await this.userService.findById(username).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: item });
    } catch (e) {
      next(e);
    }
  }

  @Post('register')
  @Middleware([uploadMiddleware('file', 10)]) // 10 : file size 
  private async addUser(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {
      const user: User = JSON.parse(req.body.jsonData) as User;
      var val = Math.floor(1000 + Math.random() * 9000);
      console.log(val);
      var avatar = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      user.code = val.toString();
      user.avatar = avatar.toString();
      
      const newUser: User = await this.userService.store(user).catch((e) => {
        throw e;
      });


      this.dataResponse.status = 200;
      this.dataResponse.data = newUser;
      this.dataResponse.message = 'Register Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Put()
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {
      const user: User = <User>req.body;
      const newUser: User = await this.userService.update(user.usr, user).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: newUser });
    } catch (e) {
      next(e);
    }
  }
}
