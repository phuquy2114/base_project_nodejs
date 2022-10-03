import { User } from '@entities/index';
import { Roles } from '../consts/Roles';
import { UserRes } from './UserRes';

export interface AuthenRes {
  user : UserRes
  token: string;
}
