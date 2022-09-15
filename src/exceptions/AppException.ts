import HttpException from './HttpException';

export default class AppException extends HttpException {
  constructor(errCd: string, message?: string) {
    super(400, errCd, message);
  }
}
