import { Request, Response, NextFunction } from 'express';
import { Controller, Middleware, Post } from '@overnightjs/core';
import Log from '../utils/Log';
import { Service } from 'typedi';
import { uploadMiddleware } from '../middleware/upload.middleware';

@Service()
@Controller('api/upload')
export class UploadController {
  private className = 'UploadController';
  constructor() {}

  @Post()
  @Middleware([uploadMiddleware('file', 10)])
  private async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'upload', `RQ`, { req: req });

    try {
      res.status(200).json({
        filename: `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      });
    } catch (e) {
      next(e);
    }
  }
}
