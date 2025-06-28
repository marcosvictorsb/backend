import { DataTypes, Model } from 'sequelize';
import mysql from '../../../infra/database/connection/mysql';
import { UserModel } from '../../users/model/user.model';

class MonthlySummaryModel extends Model {
  id!: number;
  reference_month!: string;
  total_incomes!: number;
  total_expenses!: number;
  balance!: number;
  id_user!: number;
  created_at!: Date;
  updated_at!: Date;
  deleted_at!: Date;
}

MonthlySummaryModel.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    reference_month: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(0[1-9]|1[0-2])\/\d{4}$/, // Valida formato MM/YYYY
          msg: 'reference_month deve estar no formato MM/YYYY'
        }
      }
    },
    total_incomes: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    total_expenses: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    balance: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'monthly_financial_summaries',
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

MonthlySummaryModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'user' });

export default MonthlySummaryModel;
