import { Request } from 'express';
import { JwtInfo } from '../../models/JwtInfo';

export interface LogOptions {
  json?: boolean;
  jwtPayload?: JwtInfo;
  req?: Request;
}
