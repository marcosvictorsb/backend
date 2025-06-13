import {
  FindBankCriteria,
  IBankRepository,
  UpdateBankData
} from '../../../domains/bank/interfaces';
import { DataLogOutput } from '../../../adapters/services';
import { ExpenseEntity } from '../entity/expenses.entity';
import { CreateExpensesInteractor } from '../usecases/create.expenses.interactor';
import { FindExpensesCriteria, IExpenseRepository } from './expenses';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import logger from '../../../config/logger';

export type InputCreateExpenses = {
  amount: number;
  description: string;
  id_user: number;
  status: string;
  is_recurring?: boolean;
  recurring_count?: number;
  id_bank: number;
  date_payment: Date;
};

export type CreateExpensesCriteria = {
  amount: number;
  description: string;
  id_user: number;
  id_bank: number;
  reference_month: string;
  status: string;
  date_payment?: Date;
};

export type CreateExpensesGatewayParams = {
  repository: IExpenseRepository;
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type CreateExpensesControllerParams = {
  interactor: CreateExpensesInteractor;
};

export interface ICreateExpensesGateway {
  createExpenses(data: CreateExpensesCriteria): Promise<ExpenseEntity>;
  findExpenses(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  updateBank(criteria: UpdateBankData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
