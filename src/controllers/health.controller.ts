import { Request, Response } from 'express';
import { AppResponse } from '../utils/apiResponse';
import { env } from '../config/env.config';

export class HealthController {
  static check(req: Request, res: Response): Response {
    const healthStatus = {
      status: 'UP',
      service: 'SmartShetkari Backend API',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    return AppResponse.success(req, res, healthStatus, 'SmartShetkari API is healthy and running');
  }
}
