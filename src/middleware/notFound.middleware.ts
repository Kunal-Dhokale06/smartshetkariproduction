import { Request, Response, NextFunction } from 'express';
import { AppResponse } from '../utils/apiResponse';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  return AppResponse.error(
    req,
    res,
    `Route not found: [${req.method}] ${req.originalUrl}`,
    404
  );
};
