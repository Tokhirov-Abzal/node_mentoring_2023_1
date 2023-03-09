import * as dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';
import { UserModel, GroupModel, UserGroupModel } from './models';

const dbName = process.env.DB_USERNAME as string;
const dbUser = process.env.DB_USERNAME as string;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST as string;
const dbDialect = process.env.DB_DRIVER as Dialect;

export const db = new Sequelize({
  host: dbHost,
  dialect: dbDialect,
  username: dbUser,
  database: dbName,
  password: dbPassword,
  models: [UserModel, GroupModel, UserGroupModel],
});
