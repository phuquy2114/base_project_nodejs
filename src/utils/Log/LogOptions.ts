import { Request } from 'express';
import { JwtInfo } from '../../bo/models/JwtInfo';

export interface LogOptions {
  json?: boolean;
  jwtPayload?: JwtInfo;
  req?: Request;
}
