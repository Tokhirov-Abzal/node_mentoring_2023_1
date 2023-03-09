import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { UserGroupActions } from './userGroup.helper';

const validator = createValidator({ passError: true });

export class UserGroupValidation {
  static getValidation(type: UserGroupActions) {
    switch (type) {
      case UserGroupActions.ADD_USERS:
      default:
        return validator.body(
          Joi.object({
            groupId: Joi.string().max(255).required(),
            userIds: Joi.array().items(Joi.string()).required(),
          }),
        );
    }
  }
}
