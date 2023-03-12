import { Request, Response, NextFunction } from 'express';
import { CorsOptions } from 'cors';
import { STATUS_CODES } from 'dictionary';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';
export const allowedOrigins = ['http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: (origin: string, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by Cors'));
  },
};

export const corsErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    winstonLogger.error(generateLogMessage(req.headers.origin, req.method, err.message));
    return res.status(STATUS_CODES.SYSTEM_ERROR).json({ message: err.message });
  }

  next();
};
