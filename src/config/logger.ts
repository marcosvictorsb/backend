import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports, Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

const logLevels: Record<string, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const isProduction = process.env.NODE_ENV === 'production';

const logFormat = isProduction
  ? format.combine(
      format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // ISO 8601
      format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          ...meta,
        });
      })
    )
  : format.combine(
      format.colorize(),
      format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = meta && Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaString}`;
      })
    );

const logger: Logger = createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [new transports.Console()],
});

export const setupRequestLogging = (request: Request, response: Response, next: NextFunction) => {
  try {
    const requestId = uuidv4();
    response.setHeader('x-request-id', requestId);

    const start = Date.now();

    logger.info(`🚀 Request iniciado`, {
      request_id: requestId,
      method: request.method,
      path: request.url,
    });

    logger.debug(`Request processing started for ${request.method} ${request.url}`);

    response.on('finish', () => {
      const duration = `${Date.now() - start}ms`;
      logger.info(`✅ Request finalizado`, {
        request_id: requestId,
        method: request.method,
        path: request.url,
        status: response.statusCode,
        duration,
      });
    });

    response.on('error', (err) => {
      logger.error(`❌ Request falhou`, {
        request_id: requestId,
        method: request.method,
        path: request.url,
        error: err.message,
      });
    });

    next();
  } catch (error) {
    next(error);
  }
};

export default logger;