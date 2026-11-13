export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    if (code) this.code = code;
  }
}
export const httpError = (status, message, code) => new HttpError(status, message, code);
