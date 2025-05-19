import { IIncomeRepository } from '../../../domains/incomes/interfaces';
import logger from '../../../config/logger';
import { IExpenseRepository } from '../../../domains/expenses/interfaces';
import { ExpenseEntity } from '../../../domains/expenses/entity/expenses.entity';
import { FindExpensesCriteria } from '../../../domains/expenses/interfaces';
import { FindIncomesCriteria } from '../../../domains/incomes/interfaces';
import { DataLogOutput } from '../../../adapters/services';
import { IncomeEntity } from '../../../domains/incomes/entity/income.entity';
import { GetMonthlySummaryInteractor } from '../usecases/get.monthly.summary.interactor';

export type InputGetMonthlySummary = {
  id_user: number;
};

export type GetMonthlySummaryData = {
  // Defina os campos de dados aqui
};

export type GetMonthlySummaryControllerParams = {
  interactor: GetMonthlySummaryInteractor;
};

export type GetMonthlySummaryGatewayParams = {
  incomeRepository: IIncomeRepository;
  expenseRepository: IExpenseRepository;
  logger: typeof logger;
};

export interface IGetMonthlySummaryGateway {
  findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[]>;
  findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity[]>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
