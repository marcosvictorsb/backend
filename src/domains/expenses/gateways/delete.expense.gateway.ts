import { IExpenseRepository, IDeleteExpenseGateway, DeleteExpenseGatewayParams, DeleteExpenseData, FindExpensesCriteria } from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';
import { MixDeleteExpenseService } from '../../../adapters/gateways';

export class DeleteExpenseGateway extends MixDeleteExpenseService implements IDeleteExpenseGateway {
  expenseRepository: IExpenseRepository;

  constructor(params: DeleteExpenseGatewayParams) {
    super(params);
    this.expenseRepository = params.repository;
  }

  async deleteExpense(data: DeleteExpenseData): Promise<boolean> {
    return await this.expenseRepository.delete(data);
  }

  async findExpense(criteria: FindExpensesCriteria): Promise<ExpenseEntity | null> {
    return await this.expenseRepository.find(criteria);
  }
}
