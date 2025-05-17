import {
  FindBankCriteria,
  IBankRepository,
  UpdateBankData
} from '../../../domains/bank/interfaces';
import { UpdateIncomeInteractor } from '../usecases/update.income.interactor';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { FindIncomesCriteria, IIncomeRepository } from './incomes';
import { DataLogOutput } from '../../../adapters/services';
import { IncomeEntity } from '../entity/income.entity';
import logger from '../../../config/logger';

export type InputUpdateIncome = {
  id: number;
  amount: number;
  description: string;
  id_user: number;
  status: string;
  id_bank?: number;
};

export type UpdateIncomeData = {
  id: number;
  amount: number;
  description: string;
  id_user: number;
  status: string;
  id_bank?: number;
};

export type UpdateIncomeGatewayParams = {
  repository: IIncomeRepository;
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type UpdateIncomeControllerParams = {
  interactor: UpdateIncomeInteractor;
};

export interface IUpdateIncomeGateway {
  updateIncome(data: UpdateIncomeData): Promise<boolean>;
  findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  updateBank(criteria: UpdateBankData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
