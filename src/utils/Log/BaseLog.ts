import winston, { Logform, Logger } from 'winston';
import { IBaseLog } from './IBaseLog';
import { LogOptions } from './LogOptions';

export class BaseLog implements IBaseLog {
  protected logger: Logger = null;

  constructor() {}

  protected getFormat(): Logform.Format {
    return winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint());
  }

  // eslint-disable-next-line
  protected createMsg(msgOrError: string | any, options?: LogOptions): string {
    let msg = '';
    if (typeof msgOrError === 'string') msg = msgOrError;
    else if (options?.json) msg = JSON.stringify(msgOrError);
    else if (msgOrError.message) msg = msgOrError.message;
    return msg;
  }

  // eslint-disable-next-line
  protected createMeta(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): any {
    // eslint-disable-next-line
    const data: any = {
      at: `${className}.${funcName}`
    };

    if (typeof msgOrError !== 'string' && !options?.json) {
      if (msgOrError.code) data.errorCode = msgOrError.code;
      if (msgOrError.stack) data.stack = msgOrError.stack;
    }

    if (options) {
      if (options.jwtPayload) data.jwt = `${options.jwtPayload.usr}.${options.jwtPayload.role}`;

      if (options.req) {
        data.endpoint = `${options.req.method} ${options.req.url}`;

        if (options.req.params && Object.keys(options.req.params).length) data.params = JSON.stringify(options.req.params);
        if (options.req.query && Object.keys(options.req.query).length) data.query = JSON.stringify(options.req.query);
        if (options.req.body && Object.keys(options.req.body).length) data.body = JSON.stringify({ ...options.req.body, password: undefined, pwd: undefined });
      }
    }

    return data;
  }

  // eslint-disable-next-line
  protected async log(level: string, className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.logger.log(level, this.createMsg(msgOrError, options), this.createMeta(className, funcName, msgOrError, options));
  }

  // eslint-disable-next-line
  public async error(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('error', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async warn(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('warn', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async info(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('info', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async http(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('http', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async verbose(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('verbose', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async debug(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('debug', className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public async silly(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    this.log('silly', className, funcName, msgOrError, options);
  }
}
