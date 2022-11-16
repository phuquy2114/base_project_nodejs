import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, Post } from '@overnightjs/core';
import Log from '../utils/Log';
import { Service } from 'typedi';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { JwtInfo } from 'src/models/JwtInfo';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { User } from '@entities/User';
import { UserService } from '../services/UserService';
import { BaseResponse } from '../services/BaseResponse';

@Service()
@Controller('api/upload')
export class UploadController {
  private className = 'UploadController';
  private dataResponse: BaseResponse = new BaseResponse();
  constructor(private readonly userService: UserService) { }


  @Post('avatar')
  @Middleware([checkJwt, uploadMiddleware('file', 10)])
  private async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'upload', `RQ`, { req: req });

    try {
      const jwtInfo = <JwtInfo>res.locals.jwtPayload;
      
      const user: User | undefined = await this.userService.findById(res.locals.jwtPayload['uuid']).catch((err) => {
        throw err;
      });
      var avatar = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`;
      user.avatar = avatar;
      await user.save();
      this.dataResponse.status = 200;
      this.dataResponse.data = user;
      this.dataResponse.message = 'Login Successfull';
      res.status(200).json(this.dataResponse);
      
    } catch (e) {
      next(e);
    }
  }
}
