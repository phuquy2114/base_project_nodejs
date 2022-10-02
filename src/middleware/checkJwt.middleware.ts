import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import Log from '../utils/Log';
import { JwtInfo } from '../bo/models/JwtInfo';

export const checkJwt = (req: Request, res: Response, next: NextFunction): void => {
  //Get the jwt token from the head
  let token = <string>req.headers['authorization'];
  if (token) {
    const tokenType: string = <string>process.env.TOKEN_TYPE;

    if (tokenType) token = token.substr(tokenType.length + 1);

    const jwtToken: string = <string>process.env.JWT_SECRET;

    //Try to validate the token and get data
    try {
      const jwtPayload: jwt.JwtPayload = <jwt.JwtPayload>jwt.verify(token, jwtToken);

      const jwtInfo: JwtInfo = {
        usr: jwtPayload.usr,
        role: jwtPayload.role
      };

      res.locals.jwtPayload = jwtInfo;

    } catch (ex) {
      // token invalid
      res.status(401).json({ errCd: 'author_failed' });
      Log.error('middleware', 'checkJwt', ex.message, { jwtPayload: res.locals?.jwtPayload, req: req });
      return;
    }

    //The token is expired, send a new token on every request
    // const { id, usr, role, francId, corporateId } = jwtPayload;
    // const newToken = jwt.sign({ id, usr, role, francId, corporateId }, jwtToken, {
    //   expiresIn: process.env.TOKEN_EXPIRE
    // });
    // res.setHeader('token', newToken);

    //Call the next middleware or controller
    next();
  } else {
    res.status(401).json({ errCd: 'author_failed' });
    Log.error('middleware', 'checkJwt', 'author_failed', { jwtPayload: res.locals?.jwtPayload, req: req });
  }
};
