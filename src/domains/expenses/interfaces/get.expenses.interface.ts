import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { GetExpensesInteractor } from '../usecases';
import { FindExpensesCriteria, IExpenseRepository } from './expenses';

export type InputGetExpenses = {
  reference_month: string;
  id_user: number;
};

export type GetExpensesData = {
  // Defina os campos de dados aqui
};

export type GetExpensesGatewayParams = {
  repository: IExpenseRepository;
  logger: typeof logger;
};

export interface GetExpensesControllerParams {
  interactor: GetExpensesInteractor;
}

export interface IGetExpensesGateway {
  getExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[] | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
