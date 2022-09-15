import winston from 'winston';
import { BaseLog } from './BaseLog';
import TransportStream from 'winston-transport';
//import { ApiLogService } from '../../services';
//import { ApiLog } from '../../bo/entities';

export interface DBLogConfig {
  type: string;
  host: string;
  port: string;
  usr: string;
  pwd: string;
  dbname: string;
}

class DBTransport extends TransportStream {
  private config: DBLogConfig;
  //private service: ApiLogService;

  constructor(config: DBLogConfig, opts?: TransportStream.TransportStreamOptions) {
    super(opts);
    this.config = config;
    //this.service = new ApiLogService();
  }

  // eslint-disable-next-line
  log(info: any, next: () => void): any {
    setImmediate(() => {
      this.emit('logged', info);

      //const data: ApiLog = new ApiLog();
      //data.logContent = JSON.stringify(info);
      // this.service
      //   .insert(data)
      //   .then(() => {
      //     this.emit('logged', info);
      //   })
      //   .catch((ex) => {
      //     console.log(ex);
      //   });
    });

    next();
  }
}

export class DBLog extends BaseLog {
  constructor(level: string, config: DBLogConfig) {
    super();

    this.logger = winston.createLogger({
      format: this.getFormat(),
      transports: [new DBTransport(config, { level: level })]
    });
  }
}
