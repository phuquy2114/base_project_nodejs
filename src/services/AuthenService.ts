import { User } from '../bo/entities/User';
import { AuthenReq } from '../bo/models/Authen/AuthenReq';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenRes } from '../bo/models/Authen/AuthenRes';
import * as jwt from 'jsonwebtoken';
import { JwtInfo } from '../bo/models/JwtInfo';
import AppException from '../exceptions/AppException';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
export class AuthenService extends BaseService<User, UserRepository> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }

  public async login(authenReq: AuthenReq): Promise<AuthenRes | undefined> {
    if (!authenReq.usr || authenReq.usr.trim().length === 0 || !authenReq.pwd || authenReq.pwd.trim().length === 0) {
      throw new AppException('login_failed', 'usr or pwd empty');
    }

    const user: User | undefined = await this.findById(authenReq.usr).catch((err) => {
      throw err;
    });

    if (user && user.pwd === authenReq.pwd) {
      const jwtInfo: JwtInfo = {
        usr: user.usr,
        role: user.role
      };

      const token = jwt.sign(jwtInfo, <string>process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
      const authenRes: AuthenRes = {
        usr: user.usr,
        fullname: user.fullName,
        role: user.role,
        token: token
      };

      return authenRes;
    } else {
      throw new AppException('login_failed', !user ? 'user doest not exist' : 'wrong password');
    }
  }
}
