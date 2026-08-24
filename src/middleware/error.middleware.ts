import { Request, Response, NextFunction } from 'express';
import { AppResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';
import { env } from '../config/env.config';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`Error processing ${req.method} ${req.originalUrl}:`, err.message);

  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    return AppResponse.error(
      req,
      res,
      'Validation Error',
      400,
      err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
    );
  }

  // Handle Custom Operational Errors
  if (err instanceof AppError) {
    return AppResponse.error(req, res, err.message, err.statusCode);
  }

  // Generic / Unexpected Error
  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Internal Server Error';
  const errorDetails = env.NODE_ENV === 'production' ? undefined : err.stack;

  return AppResponse.error(req, res, message, 500, errorDetails);
};
