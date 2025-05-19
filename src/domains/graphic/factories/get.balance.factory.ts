import logger from '../../../config/logger';
import ExpenseModel from '../../../domains/expenses/model/expense.model';
import { ExpenseRepository } from '../../../domains/expenses/repositories/expense.repository';
import IncomeModel from '../../../domains/incomes/model/income.model';
import { IncomeRepository } from '../../../domains/incomes/repositories/income.repository';
import { Model } from 'sequelize';
import { GetBalanceGatewayParams } from '../interfaces';
import { GetBalanceGateway } from '../gateways/get.balance.gateway';
import { GetBalanceInteractor } from '../usecases/get.balance.interactor';
import { GetBalanceController } from '../controllers/get.balance.controller';
import { Presenter } from '../../../protocols';

const incomeRepository = new IncomeRepository({ model: IncomeModel });
const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: GetBalanceGatewayParams = {
  logger,
  incomeRepository,
  expenseRepository
};

const getBalanceGateway = new GetBalanceGateway(gateway);
const presenter = new Presenter();
const interactor = new GetBalanceInteractor(getBalanceGateway, presenter);
export const getBalanceController = new GetBalanceController({ interactor });
