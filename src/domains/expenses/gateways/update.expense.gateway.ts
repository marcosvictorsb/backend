import {
  IExpenseRepository,
  IUpdateExpenseGateway,
  UpdateExpenseGatewayParams,
  UpdateExpenseData
} from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';
import { MixUpdateExpenseService } from '../../../adapters/gateways/';

export class UpdateExpenseGateway
  extends MixUpdateExpenseService
  implements IUpdateExpenseGateway
{
  expenseRepository: IExpenseRepository;

  constructor(params: UpdateExpenseGatewayParams) {
    super(params);
    this.expenseRepository = params.repository;
  }

  async updateExpense(criteria: UpdateExpenseData): Promise<boolean> {
    return await this.expenseRepository.update(criteria);
  }
}
