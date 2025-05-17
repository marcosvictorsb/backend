import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CalculateTotalExpensesInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { CalculateTotalExpensesGatewayParams } from '../interfaces';
import { CalculateTotalExpensesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CalculateTotalExpensesGateway } from '../gateways/calculate.total.expenses.gateway';

const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: CalculateTotalExpensesGatewayParams = {
  repository: expenseRepository,
  logger
};

const calculateGateway = new CalculateTotalExpensesGateway(gateway);
const presenter = new Presenter();
const interactor = new CalculateTotalExpensesInteractor(
  calculateGateway,
  presenter
);
export const calculateTotalExpensesController =
  new CalculateTotalExpensesController({ interactor });
