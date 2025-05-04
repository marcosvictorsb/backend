import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { UpdateExpenseInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { UpdateExpenseGatewayParams } from '../interfaces';
import { UpdateExpenseController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { UpdateExpenseGateway } from '../gateways/';


const expenseRepository = new ExpenseRepository({ model: ExpenseModel });

const gateway: UpdateExpenseGatewayParams = {
  repository: expenseRepository,
  logger
}

const expenseGateway = new UpdateExpenseGateway(gateway);
const presenter = new Presenter();
const interactor = new UpdateExpenseInteractor(expenseGateway, presenter);
export const updateExpensesController = new UpdateExpenseController({ interactor });