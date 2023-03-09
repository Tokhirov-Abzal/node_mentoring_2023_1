import { RequestHandler, Request } from 'express';
import { UserService } from 'api/services';
import { UserEntity } from 'entity';
import { STATUS_CODES } from 'dictionary';

export class UserController {
  static getAllUsers: RequestHandler = async (req: Request, res) => {
    try {
      const query = req.query;
      const users = await UserService.getEntityList(query);

      return res.status(STATUS_CODES.SUCCESS).json(users);
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getUserById: RequestHandler = async (req: Request<{ id: string }>, res) => {
    const params = req.params;
    try {
      const userById = await UserService.getEntityById(params);

      return res.status(STATUS_CODES.SUCCESS).json(userById);
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static createUser: RequestHandler = async (req, res) => {
    try {
      const userBody = req.body;
      await UserService.createOneEntity(new UserEntity(userBody));

      return res
        .status(STATUS_CODES.SUCCESS_CREATE)
        .json({ message: 'User is successfully created' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static updateUser: RequestHandler = async (
    req: Request<{ id: string }, any, UserEntity>,
    res,
  ) => {
    try {
      const { id } = req.params;
      const { age, isDeleted, login, password } = req.body;
      await UserService.updateEntity(id, { age, isDeleted, login, password });

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'User is successfully updated' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static deleteUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await UserService.deleteEntity(id);

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'User is successfully deleted' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}
