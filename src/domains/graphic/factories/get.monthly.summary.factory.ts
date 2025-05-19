import logger from '../../../config/logger';
import ExpenseModel from '../../../domains/expenses/model/expense.model';
import { ExpenseRepository } from '../../../domains/expenses/repositories/expense.repository';
import IncomeModel from '../../../domains/incomes/model/income.model';
import { IncomeRepository } from '../../../domains/incomes/repositories/income.repository';
import { Model } from 'sequelize';
import { GetMonthlySummaryGatewayParams } from '../interfaces';
import { GetMonthlySummaryGateway } from '../gateways/get.monthly.summary.gateway';
import { GetMonthlySummaryInteractor } from '../usecases/get.monthly.summary.interactor';
import { GetMonthlySummaryController } from '../controllers/get.monthly.summary.controller';
import { Presenter } from '../../../protocols';

const incomeRepository = new IncomeRepository({ model: IncomeModel });
const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: GetMonthlySummaryGatewayParams = {
  logger,
  incomeRepository,
  expenseRepository
};

const getMonthlySummaryGateway = new GetMonthlySummaryGateway(gateway);
const presenter = new Presenter();
const interactor = new GetMonthlySummaryInteractor(
  getMonthlySummaryGateway,
  presenter
);
export const getMonthlySummaryController = new GetMonthlySummaryController({
  interactor
});
