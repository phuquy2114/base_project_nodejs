import { NextFunction, Request, Response } from 'express';
import { Controller, Middleware, Get, Put, Post, Delete } from '@overnightjs/core';
import { checkJwt } from '../middleware/checkJwt.middleware';
import { checkRole } from '../middleware/checkRole.middleware';
import { UserService } from '../services/UserService';
import { User } from '../entities/User';
import { Roles } from '../consts/Roles';
import { Service } from 'typedi';
import Log from '../utils/Log';
import { BaseResponse } from '../services/BaseResponse';
var FCM = require('fcm-node');
var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
var fcm = new FCM(serverKey);

@Service()
@Controller('api/notification')
export class NotificationController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'CommentController';
  constructor(private readonly userService: UserService) { }

  @Get('list')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }])])
  private async listNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  @Post('push')
  @Middleware([])
  private async pushNotification(req: Request, res: Response, next: NextFunction,): Promise<void> {
    Log.info(this.className, 'addComment', `RQ`, { req: req });

    try {
      const topicName = 'push_message';
      const deviceTokens: string[] = [];
      deviceTokens.push()
      var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: deviceTokens,
        collapse_key: 'your_collapse_key',

        notification: {
          title: 'Title of your push notification',
          body: 'Body of your push notification'
        },

        data: {  //you can send only notification or only data(or include both)
          title: 'Đỗ Phú Quý',
          description: 'Phu Quy very handsome '
        }
      };

      fcm.send(message, function (err: any, response: any) {
        if (err) {
          console.log("Something has gone wrong!");
        } else {
          console.log("Successfully sent with response: ", response);
        }
      });

      this.dataResponse.status = 200;
      this.dataResponse.data = {};
      this.dataResponse.message = 'FCM Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }
}
