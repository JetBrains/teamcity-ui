import BasicError from './BasicError'

export enum HTTPCodesEnum {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
}

export class HTTPError extends BasicError {
  statusCode: HTTPCodesEnum | number | undefined
  url: string | null | undefined
  response: Response | undefined
  constructor(
    message: string,
    statusCode: HTTPCodesEnum | number | undefined,
    url?: string,
    response?: Response,
  ) {
    super(message)
    Object.setPrototypeOf(this, HTTPError.prototype)
    this.statusCode = statusCode
    this.url = url ?? null
    this.response = response
  }
}
