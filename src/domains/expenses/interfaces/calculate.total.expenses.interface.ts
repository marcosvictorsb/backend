import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { CalculateTotalExpensesInteractor } from '../usecases/calculate.total.expenses.interactor';
import { FindExpensesCriteria, IExpenseRepository } from './expenses';

export type InputCalculateTotalExpenses = {
  id_user?: number;
  reference_month: string;
};

export type CalculateTotalExpensesData = {
  id?: number;
  description?: string;
  amount?: number;
  reference_month?: string;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type CalculateTotalExpensesGatewayParams = {
  repository: IExpenseRepository;
  logger: typeof logger;
};

export type CalculateTotalExpensesControllerParams = {
  interactor: CalculateTotalExpensesInteractor;
};

export interface ICalculateTotalExpensesGateway {
  findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[] | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
