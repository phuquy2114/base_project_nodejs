import { Request, Response, NextFunction } from 'express';
import { Controller, Post } from '@overnightjs/core';
import { AuthenService } from '../services/AuthenService';
import { AuthenReq } from '../bo/models/Authen/AuthenReq';
import { AuthenRes } from '../bo/models/Authen/AuthenRes';
import Log from '../utils/Log';
import { Service } from 'typedi';

@Service()
@Controller('api/auth')
export class AuthController {
  private className = 'AuthController';
  constructor(private readonly authenService: AuthenService) {}

  @Post()
  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    try {
      const authenReq: AuthenReq = req.body;
      const authenRes: AuthenRes = await this.authenService.login(authenReq).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: authenRes });
    } catch (e) {
      next(e);
    }
  }
}
