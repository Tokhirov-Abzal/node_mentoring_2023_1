import { db } from 'db';
import { GroupModel, UserModel } from 'db/models';
import { GroupEntity, Permission } from 'entity';
import { UniqueConstraintError, DatabaseError } from 'sequelize';

export class GroupService {
  static async getEntityList(): Promise<GroupEntity[]> {
    try {
      const groups = await GroupModel.findAll();

      return groups;
    } catch (err) {
      throw Error(`GroupService Error while getEntityList ${err}`);
    }
  }

  static async getEntityById(params: { id: string }): Promise<GroupEntity | { message: string }> {
    try {
      const groupById = await GroupModel.findByPk(params.id);
      if (groupById) {
        return groupById;
      }
      return { message: 'Group is not found' };
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('Group is not found');
      }
      throw Error(`GroupService Error while getEntityById ${err}`);
    }
  }

  static async createOneEntity(group: GroupEntity): Promise<void> {
    try {
      await GroupModel.create(group);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('Group already exists');
      }

      throw Error(`GroupService Error while createOneEntity ${err}`);
    }
  }

  static async updateEntity(
    groupId: string,
    properties: { name: string; permissions: Permission[] },
  ): Promise<void> {
    try {
      await GroupModel.update(properties, { where: { id: groupId } });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('Group already exists');
      }

      throw Error(`GroupService Error while updateEntity ${err}`);
    }
  }

  static async deleteEntity(groupId: string): Promise<void> {
    try {
      await GroupModel.destroy({ where: { id: groupId } });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('Not found');
      }
      throw Error(`GroupService Error while deleteEntity ${err}`);
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

      throw Error(`GroupService Error while addUsersToEntity ${err}`);
    }
  }
}
