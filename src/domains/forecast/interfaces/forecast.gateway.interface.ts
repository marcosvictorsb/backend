import { IncomeEntity } from '../../incomes/entity/income.entity';
import { ExpenseEntity } from '../../expenses/entity/expenses.entity';
import { BankEntity } from '../../bank/entities/bank.entity';
import { FinancialForecastInteractor } from '../usecases/financial.forecast.interactor';
import logger from '../../../config/logger';

export interface IForecastRepository {
  findIncomesByUserAndMonth(userId: number, referenceMonth: string): Promise<IncomeEntity[]>;
  findExpensesByUserAndMonth(userId: number, referenceMonth: string): Promise<ExpenseEntity[]>;
  findBanksByUser(userId: number): Promise<BankEntity[]>;
}

export interface IForecastGateway {
  findIncomesByUserAndMonth(userId: number, referenceMonth: string): Promise<IncomeEntity[]>;
  findExpensesByUserAndMonth(userId: number, referenceMonth: string): Promise<ExpenseEntity[]>;
  findBanksByUser(userId: number): Promise<BankEntity[]>;
  loggerInfo(message: string, data?: any): void;
  loggerError(message: string, error?: any): void;
}

export type ForecastGatewayParams = {
  repository: IForecastRepository;
  logger: typeof logger;
};

export type ForecastControllerParams = {
  useCases: {
    financialForecast: FinancialForecastInteractor;
  };
};
