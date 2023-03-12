import { AuthController } from 'api/controllers';
import { Router } from 'express';
import { AuthValidation } from './authValidation';

const authRouter = Router();

authRouter.post('/login', AuthValidation.getValidation(), AuthController.login);
authRouter.get('/refresh', AuthController.refresh);

export default authRouter;
