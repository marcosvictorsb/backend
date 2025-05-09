import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { CreateIncomesInteractor } from '../usecases/create.incomes.interactor';
import { FindIncomesCriteria, IIncomeRepository } from './incomes';

export type InputCreateIncomes = {  
  amount: number,
  description: string,
  id_user: number,
  status: string,
  is_recurring?: boolean,
  recurring_count?: number,
};

export type CreateIncomesCriteria = {
  amount: number,
  description: string,
  id_user: number,
  reference_month: string,
  status: string
};

export type CreateIncomesGatewayParams = {
  repository: IIncomeRepository;
  logger: typeof logger;
};

export type CreateIncomesControllerParams = {
  interactor: CreateIncomesInteractor;
};

export interface ICreateIncomesGateway {
  createIncomes(data: CreateIncomesCriteria): Promise<IncomeEntity>;
  findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity | null>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
