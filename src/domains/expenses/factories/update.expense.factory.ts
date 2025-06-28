import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { UpdateExpenseInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { UpdateExpenseGatewayParams } from '../interfaces';
import { UpdateExpenseController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { UpdateExpenseGateway } from '../gateways/';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';
import BankModel from '../../../domains/bank/model/bank.model';
import { manipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/factories/';

const expenseRepository = new ExpenseRepository({ model: ExpenseModel });
const bankRepository = new BankRepository({ model: BankModel });

const gateway: UpdateExpenseGatewayParams = {
  repository: expenseRepository,
  bankRepository,
  logger
};

const expenseGateway = new UpdateExpenseGateway(gateway);
const presenter = new Presenter();
const interactor = new UpdateExpenseInteractor(
  expenseGateway,
  presenter,
  manipulateMonthlySummaryInteractor
);
export const updateExpensesController = new UpdateExpenseController({
  interactor
});
