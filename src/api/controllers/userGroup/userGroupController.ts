import { RequestHandler } from 'express';
import { UserGroupService } from 'api/services';
import { STATUS_CODES } from 'dictionary';

export class UserGroupController {
  static getAllUserGroups: RequestHandler = async (req, res) => {
    try {
      const userGroups = await UserGroupService.getEntityList();

      return res.status(STATUS_CODES.SUCCESS).json(userGroups);
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static addUsersToGroup: RequestHandler = async (req, res) => {
    try {
      const { groupId, userIds } = req.body;

      await UserGroupService.addUsersToEntity(groupId, userIds);

      return res
        .status(STATUS_CODES.SUCCESS)
        .json({ message: 'Users are successfully added to group' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}
