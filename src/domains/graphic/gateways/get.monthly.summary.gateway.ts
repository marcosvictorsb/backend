import {
  IGetMonthlySummaryGateway,
  GetMonthlySummaryGatewayParams,
  GetMonthlySummaryData
} from '../interfaces/';
import { MixGetMonthlySummaryService } from '../../../adapters/gateways/graphic/index';
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

export class GetMonthlySummaryGateway
  extends MixGetMonthlySummaryService
  implements IGetMonthlySummaryGateway
{
  incomeRepository: IIncomeRepository;
  expenseRepository: IExpenseRepository;

  constructor(params: GetMonthlySummaryGatewayParams) {
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
