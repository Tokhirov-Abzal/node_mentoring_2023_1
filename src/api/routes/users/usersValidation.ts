import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { UsersActions } from './users.helpers';

const validator = createValidator({ passError: true });

export class UsersValidation {
  static getValidation(type: UsersActions) {
    switch (type) {
      case UsersActions.UPDATE:
        return validator.body(
          Joi.object({
            login: Joi.string(),
            password: Joi.string().alphanum(),
            age: Joi.number().max(130).min(4),
            isDeleted: Joi.boolean(),
          }),
        );
      case UsersActions.CREATE:
      default:
        return validator.body(
          Joi.object({
            login: Joi.string().required(),
            password: Joi.string().alphanum().required(),
            age: Joi.number().max(130).min(4).required(),
            isDeleted: Joi.boolean().required(),
          }),
        );
    }
  }
}
