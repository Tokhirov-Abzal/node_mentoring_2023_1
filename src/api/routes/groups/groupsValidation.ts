import * as Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import { GroupsActions, groupsPermissions } from './groups.helper';

const validator = createValidator({ passError: true });

export class GroupsValidation {
  static getValidation(type: GroupsActions) {
    switch (type) {
      case GroupsActions.UPDATE:
        return validator.body(
          Joi.object({
            name: Joi.string().max(255),
            permissions: Joi.array().items(Joi.string().valid(...groupsPermissions)),
          }),
        );
      case GroupsActions.CREATE:
      default:
        return validator.body(
          Joi.object({
            name: Joi.string().max(255).required(),
            permissions: Joi.array()
              .items(Joi.string().valid(...groupsPermissions))
              .required(),
          }),
        );
    }
  }
}
