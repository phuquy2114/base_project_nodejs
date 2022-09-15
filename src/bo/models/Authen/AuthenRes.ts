import { Roles } from '../../../consts/Roles';

export interface AuthenRes {
  usr: string;
  fullname: string;
  role: Roles;
  token: string;
}
