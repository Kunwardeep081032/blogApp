// Standard api error class

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(msg: string): ApiError {
    return new ApiError(400, msg);
  }

  static unauthorized(msg: string): ApiError {
    return new ApiError(401, msg);
  }

  static forbidden(msg: string): ApiError {
    return new ApiError(403, msg);
  }

  static notFound(msg: string): ApiError {
    return new ApiError(404, msg);
  }

  static internalError(msg: string): ApiError {
    return new ApiError(500, msg, false);
  }
}

export default ApiError;
