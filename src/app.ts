import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import { NextFunction } from 'express-serve-static-core';
import { db } from './db';
import routes from './api/routes';
import { STATUS_CODES } from './dictionary';

const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());
app.use('/', routes);

// Validation error handling
// eslint-disable-next-line
app.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
  if (err && err.type) {
    const e: ExpressJoiError = err;

    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: `${e.error}` });
  }
  return res.status(STATUS_CODES.SYSTEM_ERROR).json({ message: 'internal server error' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server is running on port ${PORT}`);

  db.sync().then(() => {
    // eslint-disable-next-line
    console.log('Database is connected successfully');
  });
});
