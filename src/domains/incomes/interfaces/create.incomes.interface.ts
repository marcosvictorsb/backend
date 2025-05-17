import { FindBankCriteria, IBankRepository } from '../../../domains/bank/interfaces';
import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { CreateIncomesInteractor } from '../usecases/create.incomes.interactor';
import { FindIncomesCriteria, IIncomeRepository } from './incomes';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { UpdateBankData } from '../../../domains/bank/interfaces';

export type InputCreateIncomes = {  
  amount: number,
  description: string,
  id_user: number,
  status: string,
  id_bank: number,
  is_recurring?: boolean,
  recurring_count?: number,
};

export type CreateIncomesCriteria = {
  amount: number,
  description: string,
  id_user: number,
  id_bank: number,
  reference_month: string,
  status: string
};

export type CreateIncomesGatewayParams = {
  repository: IIncomeRepository;
  bankRepository: IBankRepository;
  logger: typeof logger;
};

export type CreateIncomesControllerParams = {
  interactor: CreateIncomesInteractor;
};

export interface ICreateIncomesGateway {
  createIncomes(data: CreateIncomesCriteria): Promise<IncomeEntity>;
  findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>
  updateBank(criteria: UpdateBankData): Promise<boolean>
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
