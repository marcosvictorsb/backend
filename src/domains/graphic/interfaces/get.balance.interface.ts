import {
  FindIncomesCriteria,
  IIncomeRepository
} from '../../../domains/incomes/interfaces';
import logger from '../../../config/logger';
import {
  FindExpensesCriteria,
  IExpenseRepository
} from '../../../domains/expenses/interfaces';
import { ExpenseEntity } from '../../../domains/expenses/entity/expenses.entity';
import { IncomeEntity } from '../../../domains/incomes/entity/income.entity';
import { DataLogOutput } from '../../../adapters/services';
import { GetBalanceInteractor } from '../usecases/get.balance.interactor';

export type InputGetBalance = {
  id_user: number;
};

export type GetBalanceData = {
  // Defina os campos de dados aqui
};

export type GetBalanceControllerParams = {
  interactor: GetBalanceInteractor;
};

export type GetBalanceGatewayParams = {
  incomeRepository: IIncomeRepository;
  expenseRepository: IExpenseRepository;
  logger: typeof logger;
};

export interface IGetBalanceGateway {
  findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[]>;
  findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity[]>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
