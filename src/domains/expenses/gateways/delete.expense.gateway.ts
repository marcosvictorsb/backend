import {
  IExpenseRepository,
  IDeleteExpenseGateway,
  DeleteExpenseGatewayParams,
  DeleteExpenseData,
  FindExpensesCriteria
} from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';
import { MixDeleteExpenseService } from '../../../adapters/gateways';
import { FindBankCriteria } from '../../../domains/bank/interfaces';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { UpdateBankData } from '../../../domains/bank/interfaces';
import { IBankRepository } from '../../../domains/bank/interfaces';

export class DeleteExpenseGateway
  extends MixDeleteExpenseService
  implements IDeleteExpenseGateway
{
  expenseRepository: IExpenseRepository;
  bankRepository: IBankRepository;

  constructor(params: DeleteExpenseGatewayParams) {
    super(params);
    this.expenseRepository = params.repository;
    this.bankRepository = params.bankRepository;
  }

  async deleteExpense(data: DeleteExpenseData): Promise<boolean> {
    return await this.expenseRepository.delete(data);
  }

  async findExpense(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | undefined> {
    return await this.expenseRepository.find(criteria);
  }

  async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
    return await this.bankRepository.find(criteria);
  }

  async updateBank(criteria: UpdateBankData): Promise<boolean> {
    return await this.bankRepository.update(criteria);
  }
}
