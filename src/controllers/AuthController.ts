import { Request, Response, NextFunction } from 'express';
import { AuthenService } from '../services/AuthenService';
import { AuthenReq } from '../models/AuthenReq';
import { AuthenRes } from '../models/AuthenRes';
import Log from '../utils/Log';
import { Service } from 'typedi';
import { Controller, Middleware, Post } from '@overnightjs/core';
import { BaseResponse } from '../services/BaseResponse';
import { CodeRes } from 'src/models/CodeRes';
import { NewPasswordReq } from 'src/models/NewPasswordReq';

@Service()
@Controller('api/auth')
export class AuthController {
  private className = 'AuthController';
  constructor(private readonly authenService: AuthenService) { }
  private dataResponse: BaseResponse = new BaseResponse();

  @Post('login')
  private async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    try {
      const authenReq: AuthenReq = req.body;
      const authenRes: AuthenRes = await this.authenService.login(authenReq).catch((e) => {
        throw e;
      });

      if (authenRes === null) {
        this.dataResponse.status = 200;
        this.dataResponse.error = 102;
        this.dataResponse.data = {};
        this.dataResponse.message = 'You need the verify code defore login account ';
        res.status(200).json(this.dataResponse);
      }

      this.dataResponse.status = 200;
      this.dataResponse.data = authenRes;
      this.dataResponse.message = 'Login Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  @Post('forgot_password')
  private async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    console.log(req.body);
    try {
      const username: string = req.body.username;
      const authenRes: CodeRes = await this.authenService.forgotPass(username).catch((e) => {
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

  @Post('new_password')
  private async newPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'register', `RQ`, { req: req });

    console.log(req.body);
    try {
      const username: NewPasswordReq = req.body;
      const authenRes: CodeRes = await this.authenService.newPass(username).catch((e) => {
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
