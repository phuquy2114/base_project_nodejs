import * as bodyParser from 'body-parser';
import * as controllers from './controllers';
import * as http from 'http';
import { Server } from '@overnightjs/core';
import Log from './utils/Log';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import 'reflect-metadata';
import Container from 'typedi';
import { createConnection, useContainer } from 'typeorm';
import * as entities from './entities/index';
import * as many2manyEntities from './entities/many2many/index';
import * as one2oneEntities from './entities/one2one/index';
import * as ormconfig from '../ormconfig';
import express from 'express';

class ApiServer extends Server {
  private className = 'ApiServer';
  private appserver: http.Server;

  private options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['jpg', 'png', 'gif'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res: any, path: any, stat: any) {
      res.set('x-timestamp', Date.now())
    }
  }

  constructor() {
    super(true);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.all('/*', this.setupCORS);
    this.app.use(express.static('public', this.options));
    this.app.use('/upload', express.static('upload'));
  }

  private async initServer(): Promise<void> {
    useContainer(Container);

    // eslint-disable-next-line
    const arrEntities: any[] = [];
    for (const name in entities) {
      if (Object.prototype.hasOwnProperty.call(entities, name)) {
        // eslint-disable-next-line
        const entity: any = (entities as any)[name];
        arrEntities.push(entity);
      }
    }

    // many2manyEntities example
    for (const name in many2manyEntities) {
      if (Object.prototype.hasOwnProperty.call(many2manyEntities, name)) {
        // eslint-disable-next-line
        const entity: any = (many2manyEntities as any)[name];
        arrEntities.push(entity);
      }
    }

    // one2oneEntities example
    for (const name in one2oneEntities) {
      if (Object.prototype.hasOwnProperty.call(one2oneEntities, name)) {
        // eslint-disable-next-line
        const entity: any = (one2oneEntities as any)[name];
        arrEntities.push(entity);
      }
    }

    // eslint-disable-next-line
    const configDB: any = {
      ...ormconfig.default,
      entities: arrEntities,
      migrations: [],
      cli: undefined
    };

    await createConnection(configDB).catch((ex) => {
      if (ex.name === 'AlreadyHasActiveConnectionError') {
        console.log('The connection is already open');
      } else {
        console.log(`** createDBConnection error:`, `config: ${JSON.stringify(configDB)} - name:${ex.name} - msg:${ex.message}`);
      }
    });
    this.setupControllers();

    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (Object.prototype.hasOwnProperty.call(controllers, name)) {
        // eslint-disable-next-line
        const controller = Container.get((controllers as any)[name]);
        ctlrInstances.push(controller);
      }
    }
    super.addControllers(ctlrInstances);
  }

  public async start(port: number): Promise<void> {
    const funcName = 'start';

    try {
      await this.initServer();

      this.appserver = this.app.listen(port, () => {
        Log.info(this.className, funcName, `Server started on port: ${port}`);
      });

      this.appserver.setTimeout(parseInt(<string>process.env.SERVER_TIMEOUT, 10));
    } catch (ex) {
      Log.info(this.className, funcName, ex);
    }
  }

  public stop(): void {
    this.appserver.close();
  }

  private setupCORS(req: Request, res: Response, next: NextFunction): void {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.header('Access-Control-Allow-Headers', `Origin, X-Requested-With, Content-type, Accept, X-Access-Token, X-Key, Authorization`);

    const allowOrigins: string[] = (<string>process.env.ALLOW_ORIGIN).split(',');
    let origin = '';
    const headersOrigin = req.headers.origin ? <string>req.headers.origin : '';

    if (allowOrigins.length === 1 && allowOrigins[0] === '*') origin = headersOrigin;
    else if (allowOrigins.indexOf(headersOrigin.toLowerCase()) > -1) origin = headersOrigin;
    else origin = allowOrigins[0];

    res.header('Access-Control-Allow-Origin', origin);

    if (req.method === 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  }
}

export default ApiServer;
