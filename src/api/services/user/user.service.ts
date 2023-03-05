import { UserModel } from 'db/models';
import { User, UserEntity } from 'entity';
import { Op, UniqueConstraintError } from 'sequelize';
import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';
export interface UserParamsId {
  id: string;
}

class UserService {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  async getEntityList(query: any): Promise<UserEntity[]> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.getEntityList.name, query),
      );
      const loginSubstring = query.loginSubstring as string;
      const limit = query.limit as number;

      const users = await UserModel.findAll({
        where: loginSubstring ? { login: { [Op.like]: `%${loginSubstring}%` } } : undefined,
        limit,
      });

      return users;
    } catch (err) {
      throw Error(`Error while getEntityList ${err}`);
    }
  }

  async getEntityById(params: UserParamsId): Promise<UserEntity | { message: string }> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.getEntityById.name, params),
      );
      const userById = await UserModel.findByPk(params.id);

      if (userById) {
        return userById;
      }
      return { message: 'User is not found' };
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('User is not found');
      }
      throw Error(`Error while getEntityById ${err}`);
    }
  }

  async createOneEntity(body: User): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.createOneEntity.name, {
          ...body,
          password: '****',
        }),
      );
      await UserModel.create(new UserEntity(body));
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('User already exists');
      }

      throw Error(`Error while createOneEntity ${err}`);
    }
  }

  async updateEntity(
    userId: string,
    properties: { login: string; password: string; age: number; isDeleted: boolean },
  ): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.updateEntity.name, {
          userId,
          ...properties,
          password: '****',
        }),
      );
      await UserModel.update(properties, { where: { id: userId } });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('User already exists');
      }

      throw Error(`Error while updateEntity ${err}`);
    }
  }

  async deleteEntity(userId: string): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.deleteEntity.name, { userId }),
      );
      await UserModel.update({ isDeleted: true }, { where: { id: userId } });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('Not found');
      }
      throw Error(`Error while deleteEntity ${err}`);
    }
  }
}

export default new UserService(winstonLogger);
