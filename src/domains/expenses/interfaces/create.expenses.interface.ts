import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { CreateExpensesInteractor } from '../usecases/create.expenses.interactor';
import { FindExpensesCriteria, IExpenseRepository } from './expenses';

export type InputCreateExpenses = {  
  amount: number,
  description: string,
  id_user: number,
  status: string,
  is_recurring?: boolean,
  recurring_count?: number,
};

export type CreateExpensesCriteria = {
  amount: number,
  description: string,
  id_user: number,
  reference_month: string,
  status: string
};

export type CreateExpensesGatewayParams = {
  repository: IExpenseRepository;
  logger: typeof logger;
};

export type CreateExpensesControllerParams = {
  interactor: CreateExpensesInteractor;
};

export interface ICreateExpensesGateway {
  createExpenses(data: CreateExpensesCriteria): Promise<ExpenseEntity>;
  findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
