import { Request, Response, NextFunction } from 'express';
import { RoleCondition } from '../models/RoleCondition';
import { JwtInfo } from '../models/JwtInfo';
import Log from '../utils/Log';

export const checkRole = (roles: Array<RoleCondition>) => {
  // eslint-disable-next-line
  return async (req: Request, res: Response, next: NextFunction) => {
    let jwtInfo: JwtInfo = null;

    try {
      jwtInfo = <JwtInfo>res.locals.jwtPayload;

      //Check if array of authorized roles includes the user's role
      const inRole: boolean = roles.findIndex((e) => e.role === jwtInfo.role) >= 0;

      if (inRole) {
        next();
      } else {
        res.status(401).json({ errCd: 'author_failed' });
        Log.error('middleware', 'checkRole', 'author_failed because: not in role', { jwtPayload: jwtInfo, req: req });
      }
    } catch (ex) {
      res.status(500).json({ errCd: 'author_error' });
      Log.error('middleware', 'checkRole', ex, { jwtPayload: jwtInfo, req: req });
    }
  };
};
