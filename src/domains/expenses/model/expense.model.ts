import { DataTypes, Model } from 'sequelize';
import mysql from '../../../infra/database/connection/mysql';
import { UserModel } from '../../users/model/user.model';


class ExpenseModel extends Model {
  id!: number;
  amount!: number;
  description!: string;
  reference_month!: string;
  id_user!: number;
  status!: string;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date;
}

ExpenseModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference_month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id_user:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,   
      defaultValue: 'pendente'
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: mysql,
    tableName: 'expenses',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
)

ExpenseModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'users' })

export default ExpenseModel
