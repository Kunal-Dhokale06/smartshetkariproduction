import { Response, Request } from 'express';
import { ApiResponse } from '../types';

export class AppResponse {
  static success<T>(
    req: Request,
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        path: req.originalUrl,
      },
    };
    return res.status(statusCode).json(response);
  }

  static created<T>(
    req: Request,
    res: Response,
    data?: T,
    message: string = 'Resource created successfully'
  ): Response {
    return AppResponse.success(req, res, data, message, 201);
  }

  static error(
    req: Request,
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    errorDetails?: any
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error: errorDetails,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        path: req.originalUrl,
      },
    };
    return res.status(statusCode).json(response);
  }
}
