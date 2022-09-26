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

@Service()
@Controller('api/user')
export class UserController {

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

      res.status(200).json({ data: result });
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
  @Middleware([])
  @Middleware([uploadMiddleware('file', 10)])
  private async addUser(req: Request, res: Response, next: NextFunction, ): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {
      const user: User = JSON.parse(req.body.jsonData) as User;
      var val = Math.floor(1000 + Math.random() * 9000);
      console.log(val);
      user.code = val.toString();
      // user.avatar = filename.toString();
      const newUser: User = await this.userService.store(user).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: newUser });
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
