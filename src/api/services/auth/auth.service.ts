import { winstonLogger } from 'config/logger';
import { UserModel } from 'db/models';
import { generateLogMessage } from 'utils';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthServiceImpl {
  loginEntity: (login: string, password: string) => Promise<{ access_token: string }>;
}

interface TokenPayload extends JwtPayload {
  id: string;
}

class AuthService implements AuthServiceImpl {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  async loginEntity(
    login: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      this.loggerService.info(generateLogMessage(this.constructor.name, this.loginEntity.name));
      const user = await UserModel.findOne({ where: { login } });

      if (!user) {
        throw Error('Invalid login');
      }

      const passwordIsMatch = await bcrypt.compare(password, user.password);

      if (!passwordIsMatch) {
        throw Error('Login or password is incorrect');
      }

      return {
        access_token: jwt.sign({ id: user.id }, process.env.SECRET_ACCESS as string, {
          expiresIn: '2h',
        }),
        refresh_token: jwt.sign({ id: user.id }, process.env.SECRET_REFRESH as string, {
          expiresIn: '1d',
        }),
      };
    } catch (err) {
      throw Error(`AuthService Error while loginEntity ${err}`);
    }
  }

  async refreshEntity(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw Error('Refresh token is not provided!');
      }

      const decode = jwt.verify(refreshToken, process.env.SECRET_REFRESH as string) as TokenPayload;

      const user = await UserModel.findOne({ where: { id: decode.id } });

      if (!user) {
        throw Error('User doesnt exist');
      }

      const access_token = jwt.sign({ id: user.id }, process.env.SECRET_ACCESS as string, {
        expiresIn: '2h',
      });

      return access_token;
    } catch (err) {
      throw Error(`AuthService Error while refreshEntity ${err}`);
    }
  }
}

export default new AuthService(winstonLogger);
