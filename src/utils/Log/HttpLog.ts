import winston from 'winston';
import { BaseLog } from './BaseLog';

export class HttpLog extends BaseLog {
  constructor(level: string, url: string, authType: string, authContent: string) {
    super();

    // protocol
    let i: number = url.indexOf('/');
    const protocol: string = url.substr(0, i + 2);
    const ssl: boolean = protocol === 'https';

    // host & port
    url = url.substr(i + 2);
    i = url.indexOf('/');
    let host: string = url.substr(0, i);
    const iPort: number = host.indexOf(':');
    const port: number = iPort >= 0 ? parseInt(host.substr(iPort + 1)) : ssl ? 443 : 80;
    if (iPort >= 0) host = host.substr(0, iPort);

    // path
    const path: string = url.substr(i + 1);

    // auth
    const username: string | undefined = authType === 'password' ? authContent.split('|')[0] : undefined;
    const password: string | undefined = authType === 'password' ? authContent.split('|')[1] : undefined;
    const bearer: string | undefined = authType === 'bearer' ? authContent : undefined;

    // create logger
    this.logger = winston.createLogger({
      format: this.getFormat(),
      transports: [
        new winston.transports.Http({
          level: level,
          host: host,
          port: port,
          path: path,
          ssl: ssl,
          auth: {
            username: username,
            password: password,
            bearer: bearer
          }
        })
      ]
    });
  }
}
