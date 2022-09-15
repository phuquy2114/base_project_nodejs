import { Request, Response, NextFunction } from 'express';
import Log from '../utils/Log';

// eslint-disable-next-line
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const msg = 'Resource not found';
  Log.error('middleware', 'errorHandler', msg, { jwtPayload: res?.locals?.jwtPayload, req: req });
  res.status(404).send(msg);
};
