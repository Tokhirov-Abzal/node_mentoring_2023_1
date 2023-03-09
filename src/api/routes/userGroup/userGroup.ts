import { Router } from 'express';
import { UserGroupController } from 'api/controllers';
import { UserGroupValidation } from './userGroupValidation';
import { UserGroupActions } from './userGroup.helper';

const userGroupRouter = Router();

userGroupRouter.get('/', UserGroupController.getAllUserGroups);
userGroupRouter.post(
  '/',
  UserGroupValidation.getValidation(UserGroupActions.ADD_USERS),
  UserGroupController.addUsersToGroup,
);

export default userGroupRouter;
