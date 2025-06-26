import logger from '../../../config/logger';
import { ForecastRepository } from '../repositories/forecast.repository';
import { ForecastGateway } from '../gateways/forecast.gateway';
import { FinancialForecastInteractor } from '../usecases/financial.forecast.interactor';
import { ForecastController } from '../controllers/forecast.controller';
import { Presenter } from '../../../protocols/presenter';
import { IncomeRepository } from '../../incomes/repositories/income.repository';
import { ExpenseRepository } from '../../expenses/repositories/expense.repository';
import { BankRepository } from '../../bank/repositories/bank.repository';
import IncomeModel from '../../incomes/model/income.model';
import ExpenseModel from '../../expenses/model/expense.model';
import BankModel from '../../bank/model/bank.model';

// Repositories
const incomeRepository = new IncomeRepository({ model: IncomeModel });
const expenseRepository = new ExpenseRepository({ model: ExpenseModel });
const bankRepository = new BankRepository({ model: BankModel });

const forecastRepository = new ForecastRepository({
  incomeRepository,
  expenseRepository,
  bankRepository
});

// Gateway
const forecastGateway = new ForecastGateway({
  repository: forecastRepository,
  logger
});

// Presenter
const presenter = new Presenter();

// Use Case
const financialForecastInteractor = new FinancialForecastInteractor(forecastGateway, presenter);

// Controller
export const forecastController = new ForecastController({
  useCases: { financialForecast: financialForecastInteractor }
});
