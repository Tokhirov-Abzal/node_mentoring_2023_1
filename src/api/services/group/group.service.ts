import { winstonLogger } from 'config/logger';
import { GroupModel } from 'db/models';
import { GroupEntity, Permission } from 'entity';
import { UniqueConstraintError } from 'sequelize';
import { generateLogMessage } from 'utils';
import { Logger } from 'winston';

class GroupService {
  private loggerService;

  constructor(logger: Logger) {
    this.loggerService = logger;
  }

  async getEntityList(): Promise<GroupEntity[]> {
    try {
      this.loggerService.info(generateLogMessage(this.constructor.name, this.getEntityList.name));
      const groups = await GroupModel.findAll();

      return groups;
    } catch (err) {
      throw Error(`GroupService Error while getEntityList ${err}`);
    }
  }

  async getEntityById(params: { id: string }): Promise<GroupEntity | { message: string }> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.getEntityById.name, params),
      );
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

  async createOneEntity(group: GroupEntity): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.createOneEntity.name, group),
      );
      await GroupModel.create(group);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('Group already exists');
      }

      throw Error(`GroupService Error while createOneEntity ${err}`);
    }
  }

  async updateEntity(
    groupId: string,
    properties: { name: string; permissions: Permission[] },
  ): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.updateEntity.name, {
          groupId,
          ...properties,
        }),
      );
      await GroupModel.update(properties, { where: { id: groupId } });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw Error('Group already exists');
      }

      throw Error(`GroupService Error while updateEntity ${err}`);
    }
  }

  async deleteEntity(groupId: string): Promise<void> {
    try {
      this.loggerService.info(
        generateLogMessage(this.constructor.name, this.deleteEntity.name, { groupId }),
      );
      await GroupModel.destroy({ where: { id: groupId } });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') {
        throw Error('Not found');
      }
      throw Error(`GroupService Error while deleteEntity ${err}`);
    }
  }
}

export default new GroupService(winstonLogger);
