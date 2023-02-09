import { Router } from 'express';
import { UserController } from 'api/controllers';
import { UsersValidation } from './usersValidation';
import { UsersActions } from './users.helpers';

const usersRouter = Router();

usersRouter.get('/', UserController.getAllUsers);
usersRouter.get('/:id', UserController.getUserById);
usersRouter.post(
  '/',
  UsersValidation.getValidation(UsersActions.CREATE),
  UserController.createUser,
);
usersRouter.put(
  '/:id',
  UsersValidation.getValidation(UsersActions.UPDATE),
  UserController.updateUser,
);
usersRouter.delete('/:id', UserController.deleteUserById);

export default usersRouter;
