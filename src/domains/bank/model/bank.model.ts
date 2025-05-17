import { UserModel } from '../../users/model/user.model';
import { DataTypes, Model } from 'sequelize';
import mysql from '../../../infra/database/connection/mysql';

class BankModel extends Model {
  id!: number;
  name!: string;
  amount!: number;
  id_user!: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date;
}

BankModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
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
      type: DataTypes.DATE
    }
  },
  {
    sequelize: mysql,
    tableName: 'banks',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

BankModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'users' });

export default BankModel;
