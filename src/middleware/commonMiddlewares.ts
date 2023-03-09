import express, { Express, Request, Response, NextFunction } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import routes from 'api/routes';
import { STATUS_CODES } from 'dictionary';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';

export const applyMiddleWare = (app: Express) => {
  app.use(express.json());
  app.use('/', routes);

  // eslint-disable-next-line
  app.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
    if (err && err.type) {
      const e: ExpressJoiError = err;

      winstonLogger.error(generateLogMessage(req.url, req.method, e.value, e.error?.message));
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: `${e.error}` });
    }
    return res.status(STATUS_CODES.SYSTEM_ERROR).json({ message: 'Internal Server Error' });
  });

  app.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
    process.on('uncaughtException', error => {
      winstonLogger.error(`Uncaught exception ${error}`);
    });

    process.on('unhandledRejection', (reason, promise) => {
      winstonLogger.error(`Unhandled rejection. Promise: ${promise} Reason: ${reason}`);
    });

    winstonLogger.error(err);

    res.status(STATUS_CODES.SYSTEM_ERROR).json({ message: 'Internal Server Error' });
    next();
  });
};
