import { IExpenseRepository, IGetExpensesGateway, GetExpensesGatewayParams, FindExpensesCriteria } from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';
import { MixGetExpensesService } from '../../../adapters/gateways/';

export class GetExpensesGateway extends MixGetExpensesService implements IGetExpensesGateway {
  expensesRepository: IExpenseRepository;

  constructor(params: GetExpensesGatewayParams) {
    super(params);
    this.expensesRepository = params.repository;
  }

  async getExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity[] | null> {
    return await this.expensesRepository.findAll(criteria);
  }
}
