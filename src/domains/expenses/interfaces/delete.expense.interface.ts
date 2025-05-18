import { FindBankCriteria, IBankRepository, UpdateBankData } from '../../../domains/bank/interfaces';
import { DataLogOutput } from '../../../adapters/services/logger.service';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { DeleteExpenseInteractor } from '../usecases/delete.expense.interactor';
import { IExpenseRepository, FindExpensesCriteria } from './expenses';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';

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
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type DeleteExpenseControllerParams = {
  interactor: DeleteExpenseInteractor;
};

export interface IDeleteExpenseGateway {
  deleteExpense(criteria: DeleteExpenseData): Promise<boolean>;
  findExpense(criteria: FindExpensesCriteria): Promise<ExpenseEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  updateBank(criteria: UpdateBankData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
