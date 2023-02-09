import { db } from 'db';
import { GroupModel, UserGroupModel, UserModel } from 'db/models';
import { UniqueConstraintError, DatabaseError } from 'sequelize';

export class UserGroupService {
  static async getEntityList(): Promise<Array<{ userId: string; groupId: string }>> {
    try {
      const userGroupsList = await UserGroupModel.findAll();

      return userGroupsList;
    } catch (err) {
      throw Error(`UserGroupService Error while getEntityList ${err}`);
    }
  }

  static async addUsersToEntity(groupId: string, userIds: string[]): Promise<void> {
    try {
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
