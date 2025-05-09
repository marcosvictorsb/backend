import { DataLogOutput } from '../../../adapters/services/logger.service';
import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { DeleteIncomeInteractor } from '../usecases/delete.income.interactor';
import { IIncomeRepository, FindIncomesCriteria } from './incomes';

export type InputDeleteIncome = {
  id_user: number;
  id: number;
};

export type DeleteIncomeData = {
  id: number
  id_user: number;
};

export type DeleteIncomeGatewayParams = {
  repository: IIncomeRepository;
  logger: typeof logger;
};

export type DeleteIncomeControllerParams = {
  interactor: DeleteIncomeInteractor;
};

export interface IDeleteIncomeGateway {
  deleteIncome(criteria: DeleteIncomeData): Promise<boolean>;
  findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
