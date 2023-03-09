import { RequestHandler, Request } from 'express';
import { STATUS_CODES } from 'dictionary';
import { GroupService } from 'api/services';
import { GroupEntity } from 'entity';

export class GroupController {
  static getAllGroups: RequestHandler = async (req, res) => {
    try {
      const groups = await GroupService.getEntityList();

      return res.status(STATUS_CODES.SUCCESS).json(groups);
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static getGroupById: RequestHandler = async (req: Request<{ id: string }>, res) => {
    const params = req.params;
    try {
      const groupById = await GroupService.getEntityById(params);

      return res.status(STATUS_CODES.SUCCESS).json(groupById);
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static createGroup: RequestHandler = async (req, res) => {
    try {
      const groupBody = req.body;
      await GroupService.createOneEntity(new GroupEntity(groupBody));

      return res
        .status(STATUS_CODES.SUCCESS_CREATE)
        .json({ message: 'Group is successfully created' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static updateGroup: RequestHandler = async (
    req: Request<{ id: string }, any, GroupEntity>,
    res,
  ) => {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;
      await GroupService.updateEntity(id, { name, permissions });

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'Group is successfully updated' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  static deleteGroupById: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      await GroupService.deleteEntity(id);

      return res.status(STATUS_CODES.SUCCESS).json({ message: 'Group is successfully deleted' });
    } catch (err) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}
