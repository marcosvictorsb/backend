import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { DeleteExpenseInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { GetExpensesGatewayParams } from '../interfaces';
import { DeleteExpenseController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { DeleteExpenseGateway } from '../gateways/';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';
import BankModel from '../../../domains/bank/model/bank.model';
import { manipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/factories/';

const expenseRepository = new ExpenseRepository({ model: ExpenseModel });
const bankRepository = new BankRepository({ model: BankModel });

const gateway: GetExpensesGatewayParams = {
  repository: expenseRepository,
  bankRepository,
  logger
};

const expenseGateway = new DeleteExpenseGateway(gateway);
const presenter = new Presenter();
const interactor = new DeleteExpenseInteractor(
  expenseGateway,
  presenter,
  manipulateMonthlySummaryInteractor
);
export const deleteExpenseController = new DeleteExpenseController({
  interactor
});
