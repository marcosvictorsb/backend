import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { GetIncomesInteractor } from '../usecases';
import { FindIncomesCriteria, IIncomeRepository } from './incomes';

export type InputGetIncomes = {
  reference_month: string;
  id_user: number;
};

export type GetIncomesData = {
  // Defina os campos de dados aqui
};

export type GetIncomesGatewayParams = {
  repository: IIncomeRepository;
  logger: typeof logger;
};

export interface GetIncomesControllerParams {
  interactor: GetIncomesInteractor
}

export interface IGetIncomesGateway {
  getIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity[] | undefined>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
