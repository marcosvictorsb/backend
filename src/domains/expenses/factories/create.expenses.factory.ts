import logger from '../../../config/logger';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpensesInteractor } from '../usecases';
import ExpenseModel from '../model/expense.model';
import { CreateExpensesGatewayParams } from '../interfaces';
import { CreateExpensesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CreateExpensesGateway } from '../gateways/create.expenses.gateway';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';
import BankModel from '../../../domains/bank/model/bank.model';

const expenseRepository = new ExpenseRepository({ model: ExpenseModel });
const bankRepository = new BankRepository({ model: BankModel })

const gateway: CreateExpensesGatewayParams = {
  repository: expenseRepository,
  bankRepository,
  logger
};

const ExpenseGateway = new CreateExpensesGateway(gateway);
const presenter = new Presenter();
const interactor = new CreateExpensesInteractor(ExpenseGateway, presenter);
export const createExpensesController = new CreateExpensesController({
  interactor
});
