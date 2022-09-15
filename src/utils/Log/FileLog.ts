import winston from 'winston';
import 'winston-daily-rotate-file';
import { BaseLog } from './BaseLog';

export interface FileLogConfig {
  filename: string;
  maxSize?: string;
  maxFile?: string;
}

export class FileLog extends BaseLog {
  constructor(level: string, config: FileLogConfig) {
    super();

    let dirname: string = undefined;
    let filename: string = config.filename;
    let i: number = filename.lastIndexOf('/');
    if (i >= 0) {
      dirname = filename.substr(0, i);
      filename = filename.substr(i + 1);
    }

    i = filename.lastIndexOf('.');
    if (i >= 0) filename = `${filename.substr(0, i)}-%DATE%${filename.substr(i)}`;
    else filename = `${filename}-%DATE%.log`;

    // create log
    this.logger = winston.createLogger({
      format: this.getFormat(),
      transports: [
        new winston.transports.DailyRotateFile({
          level: level,
          dirname: dirname,
          filename: filename,
          datePattern: 'YYYYMMDD-HHmmss',
          maxSize: config.maxSize ? config.maxSize : null,
          maxFiles: config.maxFile ? config.maxFile : null,
          zippedArchive: true
        })
      ]
    });
  }
}
