import { IExpenseRepository, ICalculateTotalExpensesGateway, CalculateTotalExpensesGatewayParams, CalculateTotalExpensesData, FindExpensesCriteria } from '../interfaces/';
import { MixCalculateTotalExpensesService } from '../../../adapters/gateways/expenses/calculate.total.expenses.gateway';
import { ExpenseEntity } from '../entity/expenses.entity';

export class CalculateTotalExpensesGateway extends MixCalculateTotalExpensesService implements ICalculateTotalExpensesGateway {
  expenseRepository: IExpenseRepository;

  constructor(params: CalculateTotalExpensesGatewayParams) {
    super(params);
    this.expenseRepository = params.repository;
  }
  async findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[] | null> {
    return await this.expenseRepository.findAll(criteria);
  }
}
