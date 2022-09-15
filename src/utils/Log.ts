import { BaseLog } from './Log/BaseLog';
import { FileLog } from './Log/FileLog';
import { HttpLog } from './Log/HttpLog';
import { ConsoleLog } from './Log/ConsoleLog';
import { LogOptions } from './Log/LogOptions';
import { DBLog } from './Log/DBLog';

export default class Log {
  private static logger: BaseLog = null;

  private static getLogger(): BaseLog {
    if (Log.logger === null) {
      const level: string = process.env.LOGGER_LEVEL;
      const mode: string = process.env.LOGGER_MODE;
      switch (mode) {
        case 'File':
          Log.logger = new FileLog(level, {
            filename: process.env.LOGGER_FILE_FILENAME,
            maxSize: process.env.LOGGER_FILE_MAX_SIZE,
            maxFile: process.env.LOGGER_FILE_MAX_FILES
          });
          break;

        case 'Http':
          Log.logger = new HttpLog(level, process.env.LOGGER_HTTP_URL, process.env.LOGGER_HTTP_AUTH_TYPE, process.env.LOGGER_HTTP_AUTH_CONTENT);
          break;

        case 'DB':
          Log.logger = new DBLog(level, {
            type: process.env.LOGGER_DB_TYPE,
            host: process.env.LOGGER_DB_HOST,
            port: process.env.LOGGER_DB_PORT,
            usr: process.env.LOGGER_DB_USERNAME,
            pwd: process.env.LOGGER_DB_PASSWORD,
            dbname: process.env.LOGGER_DB_DATABASE
          });
          break;

        case 'Custom':
          break;

        default:
          Log.logger = new ConsoleLog(level);
          break;
      }
    }

    return Log.logger;
  }

  // eslint-disable-next-line
  public static async error(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().error(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async warn(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().warn(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async info(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().info(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async http(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().http(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async verbose(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().verbose(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async debug(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().debug(className, funcName, msgOrError, options);
  }

  // eslint-disable-next-line
  public static async silly(className: string, funcName: string, msgOrError: string | any, options?: LogOptions): Promise<void> {
    Log.getLogger().silly(className, funcName, msgOrError, options);
  }
}
