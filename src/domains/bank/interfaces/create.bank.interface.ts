import logger from '../../../config/logger';
import { BankEntity } from '../entities/bank.entity';
import { CreateBankInteractor } from '../usecases';
import { CreateBankCriteria, FindBankCriteria, IBankRepository } from './bank.interface';

export type InputCreateBank = {
  id_user: number;
  amount: string;
  name: string;
};

export type CreateBankControllerParams = {
  interactor: CreateBankInteractor
}

export type CreateBankGatewayParams = {
  repository: IBankRepository;
  logger: typeof logger;
};

export interface ICreateBankGateway {
  createBank(data: CreateBankCriteria): Promise<BankEntity>;
  findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined>
  loggerInfo(message: string, data?: unknown): void;
  loggerError(message: string, data?: unknown): void;
}
