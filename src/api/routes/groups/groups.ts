import { Router } from 'express';
import { GroupController } from 'api/controllers';
import { GroupsValidation } from './groupsValidation';
import { GroupsActions } from './groups.helper';

const groupsRouter = Router();

groupsRouter.get('/', GroupController.getAllGroups);
groupsRouter.get('/:id', GroupController.getGroupById);
groupsRouter.post(
  '/',
  GroupsValidation.getValidation(GroupsActions.CREATE),
  GroupController.createGroup,
);
groupsRouter.put(
  '/:id',
  GroupsValidation.getValidation(GroupsActions.UPDATE),
  GroupController.updateGroup,
);
groupsRouter.delete('/:id', GroupController.deleteGroupById);

export default groupsRouter;
