import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { GetExpensesInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { GetExpensesGatewayParams } from '../interfaces';
import { GetExpensesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { GetExpensesGateway } from '../gateways/get.expenses.gateway';

const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: GetExpensesGatewayParams = {
  repository: expenseRepository,
  logger
};

const ExpenseGateway = new GetExpensesGateway(gateway);
const presenter = new Presenter();
const interactor = new GetExpensesInteractor(ExpenseGateway, presenter);
export const getExpensesController = new GetExpensesController({ interactor });
