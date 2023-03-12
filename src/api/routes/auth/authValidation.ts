import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';

const validator = createValidator({ passError: true });

export class AuthValidation {
  static getValidation() {
    return validator.body(
      Joi.object({
        login: Joi.string().max(255),
        password: Joi.string().max(255),
      }),
    );
  }
}
