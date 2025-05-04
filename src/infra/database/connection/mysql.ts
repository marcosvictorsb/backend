import 'dotenv/config';
import { Sequelize } from 'sequelize';
import logger from '../../../config/logger';

let sequelize: Sequelize;

const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbName = process.env.DB_NAME as string;
const host = process.env.DB_HOST as string;
const dialect = process.env.DB_DIALECT as string;


sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: dialect as any, 
  host,
  logging: (msg) => {
    logger.info("Sequelize SQL Log", { query: msg });
  },
});

export default sequelize;
