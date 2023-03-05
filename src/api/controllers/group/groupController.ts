import { RequestHandler, Request } from 'express';
import { STATUS_CODES } from 'dictionary';
import { GroupService } from 'api/services';
import { GroupEntity } from 'entity';
import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';

class GroupController {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  getAllGroups: RequestHandler = async (req, res) => {
    try {
      const groups = await GroupService.getEntityList();

      return res.status(STATUS_CODES.SUCCESS).json(groups);
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'getAllGroups', err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  getGroupById: RequestHandler = async (req: Request<{ id: string }>, res) => {
    try {
      const params = req.params;
      const groupById = await GroupService.getEntityById(params);

      return res.status(STATUS_CODES.SUCCESS).json(groupById);
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'getGroupById', req.params, err.message),
      );

      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  createGroup: RequestHandler = async (req, res) => {
    try {
      const groupBody = req.body;
      await GroupService.createOneEntity(new GroupEntity(groupBody));

      return res
        .status(STATUS_CODES.SUCCESS_CREATE)
        .json({ message: 'Group is successfully created' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'createGroup', req.body, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  updateGroup: RequestHandler = async (req: Request<{ id: string }, any, GroupEntity>, res) => {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;
      await GroupService.updateEntity(id, { name, permissions });

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'Group is successfully updated' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(
          this.constructor.name,
          'updateGroup',
          { ...req.body, ...req?.params },
          err.message,
        ),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  deleteGroupById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await GroupService.deleteEntity(id);

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'Group is successfully deleted' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(
          this.constructor.name,
          'deleteGroupById',
          { ...req?.params },
          err.message,
        ),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}

export default new GroupController(winstonLogger);
