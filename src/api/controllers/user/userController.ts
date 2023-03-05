import { RequestHandler, Request } from 'express';
import { UserService } from 'api/services';
import { UserEntity } from 'entity';
import { STATUS_CODES } from 'dictionary';
import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';

class UserController {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  getAllUsers: RequestHandler = async (req: Request, res) => {
    try {
      const query = req.query;
      const users = await UserService.getEntityList(query);

      return res.status(STATUS_CODES.SUCCESS).json(users);
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'getAllUsers', req.query, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  getUserById: RequestHandler = async (req: Request<{ id: string }>, res) => {
    const params = req.params;
    try {
      const userById = await UserService.getEntityById(params);

      return res.status(STATUS_CODES.SUCCESS).json(userById);
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'getUserById', req.params, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  createUser: RequestHandler = async (req, res) => {
    try {
      const userBody = req.body;
      await UserService.createOneEntity(userBody);

      return res
        .status(STATUS_CODES.SUCCESS_CREATE)
        .json({ message: 'User is successfully created' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'createUser', req.body, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  updateUser: RequestHandler = async (req: Request<{ id: string }, any, UserEntity>, res) => {
    try {
      const { id } = req.params;
      const { age, isDeleted, login, password } = req.body;
      await UserService.updateEntity(id, { age, isDeleted, login, password });

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'User is successfully updated' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(
          this.constructor.name,
          'updateUser',
          { ...req?.params, ...req.body },
          err.message,
        ),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  deleteUserById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await UserService.deleteEntity(id);

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'User is successfully deleted' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'deleteUserById', req.params, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}

export default new UserController(winstonLogger);
