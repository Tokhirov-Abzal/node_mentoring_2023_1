import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { GroupModel, UserModel } from '../';

@Table({
  tableName: 'userGroup',
  timestamps: false,
})
export class UserGroupModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.STRING })
  userId!: string;

  @ForeignKey(() => GroupModel)
  @Column({ type: DataType.STRING })
  groupId!: string;
}
