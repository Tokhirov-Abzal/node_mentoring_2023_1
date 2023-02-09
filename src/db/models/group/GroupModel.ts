import { Permission } from 'entity';
import {
  Model,
  Column,
  DataType,
  Table,
  PrimaryKey,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import { GroupType } from './GroupModel.typings';
import { UserModel, UserGroupModel } from '../';

@Table({
  tableName: 'groups',
  timestamps: false,
})
export class GroupModel extends Model<GroupType> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    autoIncrement: false,
  })
  id!: string;

  @Unique('name')
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  permissions!: Permission[];

  @BelongsToMany(() => UserModel, () => UserGroupModel)
  users!: UserModel[];
}
