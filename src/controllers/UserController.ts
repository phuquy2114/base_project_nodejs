import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { BaseResponse } from '../services/BaseResponse';
import { JwtInfo } from 'src/models/JwtInfo';
import { env } from 'process';
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
@Controller('api/user')
export class UserController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'UserController';
  constructor(private readonly userService: UserService) { }

  @Get('list')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async listUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const result: User[] = await this.userService.getCustomerUsers().catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = result;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Get('userId/:id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const id: string = req.params.id;
      const item: User = await this.userService.findById(id).catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = item;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Get('me')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'user', `RQ`, { req: req });
    console.log(res.locals.jwtPayload);
    try {
      const item: User = await this.userService.findById(res.locals.jwtPayload['uui']).catch((e) => {
        throw e;
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = item;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('register')
  @Middleware([uploadMiddleware('file', 10)]) // 10 : file size 
  private async addUser(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {

      const user: User = JSON.parse(req.body.jsonData) as User;

      const result: User = await this.userService.findByUserName(user.usr).catch((e) => {
        throw e;
      });

      if (result != null) {

        this.dataResponse.status = 400;
        this.dataResponse.data = {};
        if (result.usr === user.usr) {
          this.dataResponse.message = ' Username already exists ';
        } else if (result.phone === user.phone) {
          this.dataResponse.message = ' Phone already exists ';
        } else {
          this.dataResponse.message = ' User already exists ';
        }

        res.status(400).json(this.dataResponse);
        return;
      }

      var val = Math.floor(1000 + Math.random() * 9000);


      var avatar = `${process.env.UPLOAD_FOLDER}/${req.file.filename}`
      user.code = val.toString();
      user.avatar = avatar.toString();

      console.log(val);
      console.log(avatar);

      const newUser: User = await this.userService.store(user).catch((e) => {
        throw e;
      });

      if (newUser.email !== null) {
        transporter.verify(function (err: any, success: any) {
          if (err) {
            console.log(err);
          } else {
            console.log('Connected successfully');
            var mail = {
              from: process.env.EMAIL,
              to: newUser.email.toString(),
              subject: 'Verify your SOSDriver ID email address',
              text: teamplateVerfification(newUser.lastName, newUser.code),
            };

            transporter.sendMail(mail, function (err: any, info: any) {
              if (err) {
                console.log(err);
              } else {
                console.log("Mail sent: " + info.response);
              }
            });
          }
        })
      }

      this.dataResponse.status = 200;
      this.dataResponse.data = {};
      this.dataResponse.message = 'Register Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }


  @Post('code')
  private async checkCode(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {
      const result: User = await this.userService.findByUserName(req.body.username).catch((e) => {
        throw e;
      });

      if (result != null) {


        this.dataResponse.data = {};
        if (result.code !== req.body.code) {
          this.dataResponse.status = 400;
          this.dataResponse.message = ' Code not math';
          res.status(400).json(this.dataResponse);
        } else {
          this.dataResponse.status = 200;
          result.verifyCode = true;
          await result.save();
          this.dataResponse.message = 'Code Successfull';
          res.status(200).json(this.dataResponse);
        }

        return;
      } else {
        this.dataResponse.message = ' User already exists ';
      }

      this.dataResponse.status = 200;
      this.dataResponse.data = result;
      this.dataResponse.message = 'Code Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('resend_code')
  private async resendCode(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addUser', `RQ`, { req: req });

    try {
      const result: User = await this.userService.findByUserName(req.body.username).catch((e) => {
        throw e;
      });

      if (result != null) {
        this.dataResponse.status = 200;
        
      if (result.email !== null) {
        transporter.verify(function (err: any, success: any) {
          if (err) {
            console.log(err);
          } else {
            console.log('Connected successfully');
            var mail = {
              from: process.env.EMAIL,
              to: result.email.toString(),
              subject: 'Verify your SOSDriver ID email address',
              text: teamplateVerfification(result.lastName, result.code),
            };

            transporter.sendMail(mail, function (err: any, info: any) {
              if (err) {
                console.log(err);
              } else {
                console.log("Mail sent: " + info.response);
              }
            });
          }
        })
      }
        this.dataResponse.data = {
          "code": result.code
        }
        this.dataResponse.message = 'Successfull';

        res.status(200).json(this.dataResponse);
        return;
      } else {
        this.dataResponse.message = ' User already exists ';
      }

      this.dataResponse.status = 400;
      this.dataResponse.data = result;
      res.status(400).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('change_password')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });
    const jwtInfo = <JwtInfo>res.locals.jwtPayload;
    try {
      console.log(req.body.oldPass);
      console.log(req.body.newPass);
      console.log(req.body.confirmPass);
      console.log(jwtInfo);

      const user: User | undefined = await this.userService.findById(res.locals.jwtPayload['uuid']).catch((err) => {
        throw err;
      });

      if (req.body.oldPass == user.pwd) {
        user.pwd = req.body.newPass;
        const newUser: User = await this.userService.update(user.uuid, user).catch((e) => {
          throw e;
        });

        this.dataResponse.status = 200;
        this.dataResponse.data = newUser;
        this.dataResponse.message = 'Update the successfull';

        res.status(200).json(this.dataResponse);
      } else {
        this.dataResponse.status = 400;
        this.dataResponse.data = {};
        this.dataResponse.error = 101;
        this.dataResponse.message = 'Incorrect the old Password';

        res.status(200).json(this.dataResponse);
      }

    } catch (e) {
      next(e);
    }
  }

  @Put('update')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'updateUser', `RQ`, { req: req });

    try {
      console.log(req.body.firstName);
      console.log(req.body.lastName);
      console.log(req.body.avatar);
      console.log(req.body.phone);
      const user: User = <User>req.body;

      const newUser: User = await this.userService.update(user.usr, user).catch((e) => {
        throw e;
      });

      res.status(200).json({ data: newUser });
    } catch (e) {
      next(e);
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

