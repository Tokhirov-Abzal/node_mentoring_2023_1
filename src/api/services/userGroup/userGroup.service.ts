import { db } from 'db';
import { GroupModel, UserGroupModel, UserModel } from 'db/models';
import { UniqueConstraintError, DatabaseError } from 'sequelize';
import { Logger } from 'winston';
import { winstonLogger } from 'config/logger';
import { generateLogMessage } from 'utils';

class UserGroupService {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  async getEntityList(): Promise<Array<{ userId: string; groupId: string }>> {
    try {
      this.loggerService.info(generateLogMessage(this.constructor.name, this.getEntityList.name));
      const userGroupsList = await UserGroupModel.findAll();

      return userGroupsList;
    } catch (err) {
      throw Error(`UserGroupService Error while getEntityList ${err}`);
    }
  }

  async addUsersToEntity(groupId: string, userIds: string[]): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.addUsersToEntity.name, {
          groupId,
          userIds,
        }),
      );
      const group = await GroupModel.findByPk(groupId);
      await Promise.all(userIds.map(item => UserModel.findByPk(item)))
        .then(res =>
          res.forEach(item => {
            db.transaction(async t => {
              await group?.$add('user', item?.id as string, { transaction: t });
            });
          }),
        )
        .catch(err => {
          throw Error('User not found', err);
        });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('Something went wrong');
      }

      if (err instanceof DatabaseError) {
        throw Error(`Something went wrong ${err.parent}`);
      }

      throw Error(`UserGroupService Error while addUsersToEntity ${err}`);
    }
  }
}

export default new UserGroupService(winstonLogger);
