import logger from '../../../config/logger';
import { IncomeEntity } from '../entity/income.entity';
import { CalculateTotalIncomesInteractor } from '../usecases/calculate.total.incomes.interactor';
import { FindIncomesCriteria } from './incomes';
import { IIncomeRepository } from './incomes';

export type InputCalculateTotalIncomes = {
  id_user: number;
};

export type CalculateTotalIncomesData = {
  // Defina os campos de dados aqui
};

export type CalculateTotalIncomesGatewayParams = {
  repository: IIncomeRepository;
  logger: typeof logger;
};

export type CalculateTotalIncomesControllerParams = {
  interactor: CalculateTotalIncomesInteractor;
};

export interface ICalculateTotalIncomesGateway {
  findIncomes(
    criteria: FindIncomesCriteria
  ): Promise<IncomeEntity[] | undefined>;
  loggerInfo(message: string, data?: unknown): void;
  loggerError(message: string, data?: unknown): void;
}
