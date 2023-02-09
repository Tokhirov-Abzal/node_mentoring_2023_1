import { Router } from 'express';
import usersRouter from './users/users';
import groupsRouter from './groups/groups';
import userGroupRouter from './userGroup/userGroup';

const router = Router();

router.use('/users', usersRouter);
router.use('/groups', groupsRouter);
router.use('/userGroup', userGroupRouter);
export default router;
