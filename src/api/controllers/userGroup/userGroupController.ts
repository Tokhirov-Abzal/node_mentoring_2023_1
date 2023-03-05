import { RequestHandler } from 'express';
import { UserGroupService } from 'api/services';
import { STATUS_CODES } from 'dictionary';
import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';

class UserGroupController {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  getAllUserGroups: RequestHandler = async (req, res) => {
    try {
      const userGroups = await UserGroupService.getEntityList();

      return res.status(STATUS_CODES.SUCCESS).json(userGroups);
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'getAllUserGroups', undefined, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  addUsersToGroup: RequestHandler = async (req, res) => {
    try {
      const { groupId, userIds } = req.body;

      await UserGroupService.addUsersToEntity(groupId, userIds);

      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: 'Users are successfully added to group' });
    } catch (err) {
      this.loggerService.error(
        generateLogMessage(this.constructor.name, 'addUsersToGroup', req.body, err.message),
      );
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}

export default new UserGroupController(winstonLogger);
