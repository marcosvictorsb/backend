import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { DeleteExpenseInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { GetExpensesGatewayParams } from '../interfaces';
import { DeleteExpenseController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { DeleteExpenseGateway } from '../gateways/';


const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: GetExpensesGatewayParams = {
  repository: expenseRepository,
  logger
}

const expenseGateway = new DeleteExpenseGateway(gateway);
const presenter = new Presenter();
const interactor = new DeleteExpenseInteractor(expenseGateway, presenter);
export const deleteExpenseController = new DeleteExpenseController({ interactor });