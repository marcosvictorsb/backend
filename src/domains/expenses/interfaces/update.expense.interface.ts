import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { UpdateExpenseInteractor } from '../usecases/update.expense.interactor';
import { IExpenseRepository } from './expenses';

export type InputUpdateExpense = {
  id: string;
  amount: number;
  description: string;
  id_user: number;
  status: string;
};

export type UpdateExpenseData = {
  id: string;
  amount: number;
  description: string;
  id_user: number;
  status: string;
};

export type UpdateExpenseGatewayParams = {
  repository: IExpenseRepository;
  logger: typeof logger;
};

export type UpdateExpenseControllerParams = {
  interactor: UpdateExpenseInteractor;
};

export interface IUpdateExpenseGateway {
  updateExpense(data: UpdateExpenseData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
