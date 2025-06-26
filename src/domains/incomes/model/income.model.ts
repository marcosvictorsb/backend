import { DataTypes, Model } from 'sequelize';
import mysql from '../../../infra/database/connection/mysql';
import { UserModel } from '../../users/model/user.model';
import BankModel from '../../../domains/bank/model/bank.model';

class IncomeModel extends Model {
  id!: number;
  amount!: number;
  description!: string;
  reference_month!: string;
  id_user!: number;
  id_bank!: number;
  status!: string;
  date_received!: Date;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date;
}

IncomeModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference_month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'aguardando recebimento'
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    id_bank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BankModel,
        key: 'id'
      }
    },
    date_received: {
      allowNull: true,
      type: DataTypes.DATE
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
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
    tableName: 'incomes',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

IncomeModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'users' });
IncomeModel.belongsTo(BankModel, { foreignKey: 'id_bank', as: 'banks' });

export default IncomeModel;
