import morgan from 'morgan';
import { env } from '../config/env.config';

export const requestLogger = morgan(
  env.NODE_ENV === 'production' ? 'combined' : ':method :url :status :res[content-length] - :response-time ms'
);
