import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as Joi from 'joi';
import { createValidator, ExpressJoiError } from 'express-joi-validation';
import { v4 } from 'uuid';
import { STATUS_CODES } from './dictionary';
import { UserEntity } from './entity/User.entity';
import { findUserById, findUserByLogin, getAutoSuggestUsers } from './helper';
import { NextFunction } from 'express-serve-static-core';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());

let users: UserEntity[] = [];

const validator = createValidator({ passError: true });

const userSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().max(130).min(4).required(),
  isDeleted: Joi.boolean().required(),
});

// GET

app.get('/users', (req, res) => {
  const { limit, loginSubstring } = req.query;
  const filteredUsers = getAutoSuggestUsers(users, loginSubstring as string, Number(limit));

  res.status(STATUS_CODES.SUCCESS).json(filteredUsers);
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const userById = findUserById(id, users);

  if (userById) {
    return res.status(STATUS_CODES.SUCCESS).json(userById);
  }

  return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'User has not been found' });
});

// POST

app.post('/users', validator.body(userSchema), (req, res) => {
  const { login, password, age, isDeleted } = req.body;
  const id = v4();

  const userIsExist = findUserByLogin(login, users);

  if (!userIsExist) {
    users.push(new UserEntity({ id, login, password, age, isDeleted }));

    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User has been created successfully' });
  }

  return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'User already exists' });
});

// PUT

app.put('/users/:id', validator.body(userSchema), (req, res) => {
  const { id } = req.params;
  const updatedProps = req.body;
  const userById = findUserById(id, users);

  if (!userById) {
    return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User does not exist' });
  }

  if (userById) {
    users = users.map(userObj => (userObj.id === id ? { ...userObj, ...updatedProps } : userObj));

    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User has been updated successfully' });
  }

  return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Bad request' });
});

// Validation error handling

// eslint-disable-next-line
app.use((err: any | ExpressJoiError, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const e: ExpressJoiError = err;

    return res.status(STATUS_CODES.BAD_REQUEST).json({ message: `${e.error}` });
  }
  return res.status(STATUS_CODES.SYSTEM_ERROR).json({ message: 'internal server error' });
});

// DELETE

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const userById = findUserById(id, users);

  if (userById) {
    users = users.map(userObj => (userObj.id === id ? { ...userObj, isDeleted: true } : userObj));

    return res.status(STATUS_CODES.SUCCESS).json({ message: 'User has been successfully deleted' });
  }

  res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Bad request' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`Server is running on port ${PORT}`);
});
