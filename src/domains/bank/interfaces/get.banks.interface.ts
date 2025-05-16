import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { BankEntity } from '../entities/bank.entity';
import { GetBanksInteractor } from '../usecases';
import { FindBankCriteria, IBankRepository } from './index';

export type InputGetBanks = {
  id_user: number
}

export type GetBanksData = {
  // Defina os campos de dados aqui
};

export type GetBanksGatewayParams = {
  repository: IBankRepository;
  logger: typeof logger;
};

export type GetBanksControllerParams = {
  interactor: GetBanksInteractor;
}

export interface IGetBanksGateway {
  getBanks(criteria: FindBankCriteria): Promise<BankEntity[] | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
