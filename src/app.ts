import * as dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import { db } from './db';
import { applyMiddleWare } from 'middleware/commonMiddlewares';
import { winstonLogger } from 'config/logger';

const PORT = process.env.PORT || 3000;
const app: Express = express();

applyMiddleWare(app);

app.listen(PORT, () => {
  // eslint-disable-next-line
  winstonLogger.info(`Server is running on port ${PORT}`);

  db.sync().then(() => {
    // eslint-disable-next-line
    winstonLogger.info('Database is connected successfully');
  });
});
