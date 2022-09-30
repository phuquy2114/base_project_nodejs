import { Request, Response, NextFunction } from 'express';
import { AuthenService } from '../services/AuthenService';
import { AuthenReq } from '../bo/models/AuthenReq';
import { AuthenRes } from '../bo/models/AuthenRes';
import Log from '../utils/Log';
import { Service } from 'typedi';
import { Controller, Middleware, Post } from '@overnightjs/core';
import { BaseResponse } from '../services/BaseResponse';

@Service()
@Controller('api/auth')
export class AuthController {
  private className = 'AuthController';
  constructor(private readonly authenService: AuthenService) {}
  private dataResponse: BaseResponse = new BaseResponse();

  @Post('login')
  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    try {
      const authenReq: AuthenReq = req.body;
      const authenRes: AuthenRes = await this.authenService.login(authenReq).catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = authenRes;
      this.dataResponse.message = 'Login Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
