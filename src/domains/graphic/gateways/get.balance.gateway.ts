import {
  IGetBalanceGateway,
  GetBalanceGatewayParams,
  GetBalanceData
} from '../interfaces/';
import { MixGetBalanceService } from '../../../adapters/gateways/graphic/get.balance.gateway';
import {
  FindIncomesCriteria,
  IIncomeRepository
} from '../../../domains/incomes/interfaces';
import {
  FindExpensesCriteria,
  IExpenseRepository
} from '../../../domains/expenses/interfaces';
import { ExpenseEntity } from '../../../domains/expenses/entity/expenses.entity';
import { IncomeEntity } from '../../../domains/incomes/entity/income.entity';

export class GetBalanceGateway
  extends MixGetBalanceService
  implements IGetBalanceGateway
{
  incomeRepository: IIncomeRepository;
  expenseRepository: IExpenseRepository;

  constructor(params: GetBalanceGatewayParams) {
    super(params);
    this.incomeRepository = params.incomeRepository;
    this.expenseRepository = params.expenseRepository;
  }

  async findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[]> {
    return await this.expenseRepository.findAll(criteria);
  }
  async findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity[]> {
    return await this.incomeRepository.findAll(criteria);
  }
}
