import { User } from '../entities/User';
import { AuthenReq } from '../models/AuthenReq';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenRes } from '../models/AuthenRes';
import * as jwt from 'jsonwebtoken';
import { JwtInfo } from '../models/JwtInfo';
import AppException from '../exceptions/AppException';
import { BaseService } from './BaseService';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserRes } from 'src/models/UserRes';
import { CodeRes } from 'src/models/CodeRes';
import { NewPasswordReq } from 'src/models/NewPasswordReq';
import { LocationRes } from 'src/models/LocationRes';
import { BaseResponse } from './BaseResponse';
var nodemailler = require('nodemailer');

const option = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
}

var transporter = nodemailler.createTransport(option);

@Service()
export class AuthenService extends BaseService<User, UserRepository> {
  constructor(@InjectRepository(User) repository: UserRepository) {
    super(repository);
  }
  private dataResponse: BaseResponse = new BaseResponse();

  public async login(authenReq: AuthenReq): Promise<AuthenRes | undefined> {
    console.log('start');
    console.log(authenReq);

    if (!authenReq.usr || authenReq.usr.trim().length === 0 || !authenReq.pwd || authenReq.pwd.trim().length === 0) {
      throw new AppException('login_failed', 'usr or pwd empty');
    }

    var user: User;
    try {
      console.log('getByUsername');
      user = await this.repository.getByUsername(authenReq.usr);
      if (user == null) {
        console.log('getByEmail');
        user = await this.repository.getByEmail(authenReq.usr);
      }
      if (user == null) {
        console.log('getByPhone');
        user = await this.repository.getByPhone(authenReq.usr.replace(" ", ""));
      }
    } catch (error) {
      console.log(error);
    }

    console.log('user');
    console.log(user);

    if (user.verifyCode === false) {
      console.log('verifyCode false');
      return null;
    }

    if (user && user.pwd === authenReq.pwd) {
      const jwtInfo: JwtInfo = {
        uuid: user.uuid,
        usr: user.usr,
        role: user.role
      };

      const token = jwt.sign(jwtInfo, <string>process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRE });

      const location: LocationRes = {
        address: user.location.address,
        log: parseFloat(user.location.log?.toString() || null),
        lat: parseFloat(user.location.lat?.toString() || null),
      };

      const userResData: UserRes = {
        id: user.uuid,
        usr: user.usr,
        fullname: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        phone: user.phone,
        role: user.role,
        location: location,
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

  public async forgotPass(username: string): Promise<CodeRes | undefined> {
    console.log('start');
    console.log(username);

    if (username.trim().length === 0) {
      throw new AppException('login_failed', 'username  empty');
    }

    console.log('getByUsername');

    const user: User | undefined = await this.repository.getByUsername(username).catch((err) => {
      throw err;
    });

    console.log('user');
    console.log(user);

    var codeRan = Math.floor(1000 + Math.random() * 9000);
    user.code = codeRan.toString();
    await user.save();

    try {

      transporter.verify(function (err: any, success: any) {
        if (err) {
          console.log(err);
        } else {
          console.log('Connected successfully');
          var mail = {
            from: process.env.EMAIL,
            to: user.email.toString(),
            subject: 'Verify your SOSDriver ID email address',
            text: teamplateVerfification(user.lastName, user.code),
          };

          transporter.sendMail(mail, function (err: any, info: any) {
            if (err) {
              console.log(err);
            } else {
              console.log("Mail sent: " + info.response);
            }
          });
        }
      });
    } catch (e) { }

    if (user) {
      const code: CodeRes = {
        code: user.code
      }

      return code;
    } else {
      throw new AppException('The User doest not exist', !user ? 'user doest not exist' : 'wrong password');
    }
  }

  public async newPass(body: NewPasswordReq): Promise<CodeRes | undefined> {
    console.log('start');
    console.log(body);

    if (body.username.trim().length === 0) {
      throw new AppException('login_failed', 'username  empty');
    }

    console.log('getByUsername');

    const user: User | undefined = await this.repository.getByUsername(body.username).catch((err) => {
      throw err;
    });

    if (user) {
      if (body.code === user.code) {
        throw new AppException('login_failed', 'Code not math');
      }

      user.pwd = body.newPass;
      await this.repository.updateNewPassword(body.username, body.newPass).catch((err) => {
        throw err;
      });

      const code: CodeRes = {
        code: "0000"
      }
      return code;
    } else {
      throw new AppException('The User doest not exist', !user ? 'user doest not exist' : 'wrong password');
    }
  }
}


export default function teamplateVerfification(fullName: string, code: string): string {
  return ` Hi  ${fullName} \n\t`

    + `\n Your verification code is  ${code} \n\t`

    + '\n Enter this code in our [SOS DRIVER] to activate your account.\n\t '

    + '\n Click here [open code in app] to open the [app/portal landing page].\n\t '

    + '\n If you have any questions, send us an email [serveruits@gmail.com to your support team].\n\t '

    + '\n We’re glad you’re here! \n\t '
    + '\n The [SOS DRIVER] team \n\t ';
}

