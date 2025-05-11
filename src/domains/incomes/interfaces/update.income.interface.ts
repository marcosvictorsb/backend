import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { UpdateIncomeInteractor } from '../usecases/update.incomes.interactor';
import { IIncomeRepository } from './incomes';

export type InputUpdateIncome = {
  id: string;
  amount: number;
  description: string
  id_user: number
  status: string
};

export type UpdateIncomeData = {
  id: string;
  amount: number;
  description: string
  id_user: number
  status: string
};

export type UpdateIncomeGatewayParams = {
  repository: IIncomeRepository;
  logger: typeof logger;
};

export type UpdateIncomeControllerParams = { 
  interactor: UpdateIncomeInteractor;
}

export interface IUpdateIncomeGateway {
  updateIncome(data: UpdateIncomeData): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
