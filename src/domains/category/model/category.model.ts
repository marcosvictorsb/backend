import { UserModel } from '../../users/model/user.model';
import { DataTypes, Model } from 'sequelize';
import mysql from '../../../infra/database/connection/mysql';

class CategoryModel extends Model {
  id!: number;
  name!: string;
  id_user!: number;
  color!: string;
}

CategoryModel.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      },
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#000000'
    }
  },
  {
    sequelize: mysql,
    tableName: 'categories',
    timestamps: false,
    underscored: true,
    paranoid: true
  }
);

CategoryModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'users' });

export default CategoryModel;
