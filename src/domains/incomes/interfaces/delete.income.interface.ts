import {
  FindBankCriteria,
  IBankRepository,
  UpdateBankData
} from '../../../domains/bank/interfaces';
import { DataLogOutput } from '../../../adapters/services/logger.service';
import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { DeleteIncomeInteractor } from '../usecases/delete.income.interactor';
import { IIncomeRepository, FindIncomesCriteria } from './incomes';

export type InputDeleteIncome = {
  id_user: number;
  id: number;
};

export type DeleteIncomeData = {
  id: number;
  id_user: number;
};

export type DeleteIncomeGatewayParams = {
  repository: IIncomeRepository;
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type DeleteIncomeControllerParams = {
  interactor: DeleteIncomeInteractor;
};

export interface IDeleteIncomeGateway {
  deleteIncome(criteria: DeleteIncomeData): Promise<boolean>;
  findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  updateBank(criteria: UpdateBankData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
