import { User } from '../bo/entities/User';
import { AuthenReq } from '../bo/models/AuthenReq';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenRes } from '../bo/models/AuthenRes';
import * as jwt from 'jsonwebtoken';
import { JwtInfo } from '../bo/models/JwtInfo';
import AppException from '../exceptions/AppException';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRes } from 'src/bo/models/UserRes';
import { CodeRes } from 'src/bo/models/CodeRes';

@Service()
export class AuthenService extends BaseService<User, UserRepository> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }

  public async login(authenReq: AuthenReq): Promise<AuthenRes | undefined> {
    console.log('start');
    console.log(authenReq);
    if (!authenReq.usr || authenReq.usr.trim().length === 0 || !authenReq.pwd || authenReq.pwd.trim().length === 0) {
      throw new AppException('login_failed', 'usr or pwd empty');
    }

    console.log('getByUsername');
    const user: User | undefined = await this.repository.getByUsername(authenReq.usr).catch((err) => {
      throw err;
    });

    console.log('user');
    console.log(user);

    if (user && user.pwd === authenReq.pwd) {
      const jwtInfo: JwtInfo = {
        usr: user.usr,
        role: user.role
      };

      const token = jwt.sign(jwtInfo, <string>process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });
      const userResData: UserRes = {
        usr: user.usr,
        fullname: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        location: user.location,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      const authenRes: AuthenRes = {
        user: userResData,
        token: token
      };

      return authenRes;
    } else {
      throw new AppException('login_failed', !user ? 'user doest not exist' : 'wrong password');
    }
  }

  public async forgotPass(authenReq: string): Promise<CodeRes | undefined> {
    console.log('start');
    console.log(authenReq);

    if (authenReq.trim().length === 0) {
      throw new AppException('login_failed', 'username  empty');
    }

    console.log('getByUsername');
    const user: User | undefined = await this.repository.getByUsername(authenReq).catch((err) => {
      throw err;
    });
    console.log('user');
    console.log(user);
    
    if (user) {
      const code: CodeRes = {
        code: "1234"
      }

      return code;
    } else {
      throw new AppException('login_failed', !user ? 'user doest not exist' : 'wrong password');
    }
  }
}
