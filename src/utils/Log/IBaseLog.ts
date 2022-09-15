import { LogOptions } from './LogOptions';

export interface IBaseLog {
  // eslint-disable-next-line
  error(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  warn(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  info(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  http(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  verbose(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  debug(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;

  // eslint-disable-next-line
  silly(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void>;
}
