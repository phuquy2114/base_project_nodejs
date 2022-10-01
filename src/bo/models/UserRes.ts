import { Roles } from "src/consts/Roles";
import {Location} from '../entities/Location';

export interface UserRes {
    usr: string;
    fullname: string;
    firstName: string;
    lastName: string;
    avatar: string;
    phone: string;
    role: Roles;
    location: Location;
    createdAt: string;
    updatedAt: string;
  }
  