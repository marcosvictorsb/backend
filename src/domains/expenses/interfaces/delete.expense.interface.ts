import { DataLogOutput } from '../../../adapters/services/logger.service';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { DeleteExpenseInteractor } from '../usecases/delete.expense.interactor';
import { IExpenseRepository, FindExpensesCriteria } from './expenses';

export type InputDeleteExpense = {
  id_user: number;
  id: number;
};

export type DeleteExpenseData = {
  id: number;
  id_user: number;
};

export type DeleteExpenseGatewayParams = {
  repository: IExpenseRepository;
  logger: typeof logger;
};

export type DeleteExpenseControllerParams = {
  interactor: DeleteExpenseInteractor;
};

export interface IDeleteExpenseGateway {
  deleteExpense(criteria: DeleteExpenseData): Promise<boolean>;
  findExpense(criteria: FindExpensesCriteria): Promise<ExpenseEntity | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
