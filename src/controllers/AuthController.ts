import { Request, Response, NextFunction } from 'express';
import { AuthenService } from '../services/AuthenService';
import { AuthenReq } from '../bo/models/Authen/AuthenReq';
import { AuthenRes } from '../bo/models/Authen/AuthenRes';
import Log from '../utils/Log';
import { Service } from 'typedi';
import { Controller, Middleware, Post } from '@overnightjs/core';
import { checkRole } from '../middleware/checkRole.middleware';
import { Roles } from '../consts/Roles';

@Service()
@Controller('api/auth')
export class AuthController {
  private className = 'AuthController';
  constructor(private readonly authenService: AuthenService) {}

  @Post('login')
  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    try {
      const authenReq: AuthenReq = req.body;
      const authenRes: AuthenRes = await this.authenService.login(authenReq).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: authenRes });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
