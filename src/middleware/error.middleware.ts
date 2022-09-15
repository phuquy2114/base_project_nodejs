import HttpException from '../exceptions/HttpException';
import { Request, Response, NextFunction } from 'express';
import Log from '../utils/Log';
import { ERROR_CODE } from '../consts/ErrorCode';

// eslint-disable-next-line
export const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
  const status = error.statusCode || 500;
  Log.error('middleware', 'errorHandler', error, { json: true, jwtPayload: res?.locals?.jwtPayload, req: req });

  const errCode = error.errCd || ERROR_CODE.SYSTEM_ERROR;
  res.status(status).json({ errCd: errCode });
};
