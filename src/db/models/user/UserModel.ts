import {
  Model,
  Column,
  DataType,
  Table,
  PrimaryKey,
  Unique,
  BelongsToMany,
} from 'sequelize-typescript';
import { GroupModel, UserGroupModel } from '../';
import { UserType } from './UserModel.typings';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class UserModel extends Model<UserType> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    autoIncrement: false,
  })
  id!: string;

  @Unique('login')
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  login!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isDeleted!: boolean;

  @BelongsToMany(() => GroupModel, () => UserGroupModel)
  groups!: GroupModel[];
}
