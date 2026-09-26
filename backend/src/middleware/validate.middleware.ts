import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      // Apply transformed values back so controllers get the normalized data
      req.body = parsed.body ?? req.body;
      return next();
    } catch (error) {
      return next(error);
    }
  };
};
