import { Request, Response, NextFunction } from 'express';

import constants from './constants';
import { Logger } from './Logger';

export interface ErrorType {
  statusCode: number;
  name: string;
  message: string;
  fields?: { [field: string]: { message: string } };
}

export class ApiError extends Error implements ErrorType {
  public statusCode = 500;
  public fields?: { [field: string]: { message: string } };

  constructor(errorType: ErrorType) {
    super(errorType.message);
    this.name = errorType.name;
    if (errorType.statusCode) this.statusCode = errorType.statusCode;
    this.fields = errorType.fields;
  }
}

export class ErrorHandler {
  public static handleError(error: ApiError, req: Request, res: Response, next: NextFunction): void {
    const { name, message, fields, statusCode } = error;
    Logger.error(
      `Error: ${statusCode}`,
      `Error Name: ${name}`,
      `Error Message: ${message}`,
      'Error Fields:', fields || {},
      'Original Error: ', error
    );
    res.status(statusCode).json({ name, message, fields });
    next();
  }

}
