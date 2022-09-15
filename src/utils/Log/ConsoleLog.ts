import winston from 'winston';
import { BaseLog } from './BaseLog';

export class ConsoleLog extends BaseLog {
  constructor(level: string) {
    super();

    this.logger = winston.createLogger({
      format: this.getFormat(),
      transports: [new winston.transports.Console({ level: level })]
    });
  }
}
