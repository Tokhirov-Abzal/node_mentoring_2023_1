import { Router } from 'express';
import { UserController } from 'api/controllers';
import { UsersValidation } from './usersValidation';
import { UsersActions } from './users.helpers';
import { authMiddleWare } from 'middleware/authMiddleware';

const usersRouter = Router();

usersRouter.get('/', authMiddleWare, UserController.getAllUsers);
usersRouter.get('/:id', authMiddleWare, UserController.getUserById);
usersRouter.post(
  '/',
  UsersValidation.getValidation(UsersActions.CREATE),
  UserController.createUser,
);
usersRouter.put(
  '/:id',
  authMiddleWare,
  UsersValidation.getValidation(UsersActions.UPDATE),
  UserController.updateUser,
);
usersRouter.delete('/:id', authMiddleWare, UserController.deleteUserById);

export default usersRouter;
