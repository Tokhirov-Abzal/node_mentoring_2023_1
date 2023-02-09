import { UserModel } from 'db/models';
import { UserEntity } from 'entity';
import { Op, UniqueConstraintError } from 'sequelize';

export interface UserParamsId {
  id: string;
}

export class UserService {
  static async getEntityList(query: any): Promise<UserEntity[]> {
    try {
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

  static async getEntityById(params: UserParamsId): Promise<UserEntity | { message: string }> {
    try {
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

  static async createOneEntity(user: UserEntity): Promise<void> {
    try {
      await UserModel.create(user);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('User already exists');
      }

      throw Error(`Error while createOneEntity ${err}`);
    }
  }

  static async updateEntity(
    userId: string,
    properties: { login: string; password: string; age: number; isDeleted: boolean },
  ): Promise<void> {
    try {
      await UserModel.update(properties, { where: { id: userId } });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('User already exists');
      }

      throw Error(`Error while updateEntity ${err}`);
    }
  }

  static async deleteEntity(userId: string): Promise<void> {
    try {
      await UserModel.update({ isDeleted: true }, { where: { id: userId } });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('Not found');
      }
      throw Error(`Error while deleteEntity ${err}`);
    }
  }
}
