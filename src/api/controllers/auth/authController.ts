import { RequestHandler } from 'express';
import { STATUS_CODES } from 'dictionary';

import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';
import { AuthService } from 'api/services';

class AuthController {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  login: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body;
      const { access_token, refresh_token } = await AuthService.loginEntity(login, password);
      const refreshExpiresIn = 172800000;

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: refreshExpiresIn,
      });
      return res.status(STATUS_CODES.SUCCESS).json({ access_token });
    } catch (err) {
      this.loggerService.error(generateLogMessage(this.constructor.name, 'login', err.message));
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };

  refresh: RequestHandler = async (req, res) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const access_token = await AuthService.refreshEntity(refresh_token);

      return res.status(STATUS_CODES.SUCCESS).json({ access_token });
    } catch (err) {
      this.loggerService.error(generateLogMessage(this.constructor.name, 'refresh', err.message));
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: err.message });
    }
  };
}

export default new AuthController(winstonLogger);
