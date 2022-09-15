export default class HttpException extends Error {
  statusCode: number;
  errCd: string;
  message: string | null;

  constructor(statusCode: number, errCd: string, message?: string) {
    super(errCd);

    this.statusCode = statusCode || 500;
    this.errCd = errCd;
    this.message = message || null;
  }
}
