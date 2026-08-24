import { env } from '../config/env.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  info(message: string, meta?: any): void {
    console.log(`\x1b[32m${this.formatMessage('info', message, meta)}\x1b[0m`);
  }

  warn(message: string, meta?: any): void {
    console.warn(`\x1b[33m${this.formatMessage('warn', message, meta)}\x1b[0m`);
  }

  error(message: string, meta?: any): void {
    console.error(`\x1b[31m${this.formatMessage('error', message, meta)}\x1b[0m`);
  }

  debug(message: string, meta?: any): void {
    if (env.NODE_ENV !== 'production') {
      console.debug(`\x1b[36m${this.formatMessage('debug', message, meta)}\x1b[0m`);
    }
  }
}

export const logger = new Logger();
