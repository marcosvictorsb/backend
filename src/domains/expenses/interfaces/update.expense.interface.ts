import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { ExpenseEntity } from '../entity/expenses.entity';
import { UpdateExpenseInteractor } from '../usecases/update.expense.interactor';
import { FindExpensesCriteria, IExpenseRepository } from './expenses';
import {
  FindBankCriteria,
  IBankRepository
} from '../../../domains/bank/interfaces';
import { UpdateBankData } from '../../../domains/bank/interfaces';

export type InputUpdateExpense = {
  id: number;
  amount: number;
  description: string;
  id_user: number;
  id_bank: number;
  date_payment: Date;
  status: string;
};

export type UpdateExpenseData = {
  id: number;
  amount: number;
  description: string;
  id_user: number;
  id_bank: number;
  status: string;
  date_payment: Date;
};

export type UpdateExpenseGatewayParams = {
  repository: IExpenseRepository;
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type UpdateExpenseControllerParams = {
  interactor: UpdateExpenseInteractor;
};

export interface IUpdateExpenseGateway {
  updateExpense(data: UpdateExpenseData): Promise<boolean>;
  findExpense(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  updateBank(criteria: UpdateBankData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
