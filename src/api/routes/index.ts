import { Router } from 'express';
import usersRouter from './users/users';
import groupsRouter from './groups/groups';
import userGroupRouter from './userGroup/userGroup';
import authRouter from './auth/auth';
import { authMiddleWare } from 'middleware/authMiddleware';

const router = Router();

router.use('/users', authMiddleWare, usersRouter);
router.use('/groups', authMiddleWare, groupsRouter);
router.use('/userGroup', authMiddleWare, userGroupRouter);
router.use('/auth', authRouter);

export default router;
