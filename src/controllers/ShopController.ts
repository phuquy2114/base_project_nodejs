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

@Service()
@Controller('api/shop')
export class ShopController {

  private dataResponse: BaseResponse = new BaseResponse();
  private className = 'ShopController';
  constructor(private readonly userService: UserService) { }

  @Get('list')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async listUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const result: User[] = await this.userService.getServiceUsers().catch((e) => {
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

  @Get('nearby_shop')
  @Middleware([checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async nearByShop(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'listUser', `RQ`, { req: req });

    try {
      const lat = req.query.currentLat;
      const long = req.query.currentLong;
      const range = req.query.range;

      console.log(lat)
      console.log(long)
      console.log(range)

      const result: User[] = await this.userService.getServiceUsers().catch((e) => {
        throw e;
      });

      const newResult: User[] = result.filter(user => this.calcCrow(user.location.lat, user.location.log, parseFloat(lat.toString()), parseFloat(long.toString())) <= (parseInt(range.toString()) / 1000));

      this.dataResponse.status = 200;
      this.dataResponse.data = newResult;
      this.dataResponse.message = 'Successfull';
      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Get(':id')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
  private async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    Log.info(this.className, 'getUser', `RQ`, { req: req });

    try {
      const id: string = req.params.id;
      const item: User = await this.userService.findById(id, {

        where: {
          role: Roles.CUSTOMER,
        },

      }).catch((e) => {
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

        this.dataResponse.status = 200;
        this.dataResponse.data = {};
        if (result.usr === user.usr) {
          this.dataResponse.message = ' Username already exists ';
        } else if (result.phone === user.phone) {
          this.dataResponse.message = ' Phone already exists ';
        } else {
          this.dataResponse.message = ' User already exists ';
        }

        res.status(200).json(this.dataResponse);
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


      this.dataResponse.status = 200;
      this.dataResponse.data = newUser;
      this.dataResponse.message = 'Register Successfull';

      res.status(200).json(this.dataResponse);
    } catch (e) {
      next(e);
    }
  }

  @Post('change_password')
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
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
  @Middleware([checkJwt, checkRole([{ role: Roles.CORPORATE }, { role: Roles.CUSTOMER }])])
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

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  private calcCrow(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log(d);
    return d;
  }

  // Converts numeric degrees to radians
  private toRad(value: number) {
    return value * Math.PI / 180;
  }

  private distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string = 'K') {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }
}
