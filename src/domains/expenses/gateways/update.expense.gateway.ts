import {
  IExpenseRepository,
  IUpdateExpenseGateway,
  UpdateExpenseGatewayParams,
  UpdateExpenseData,
  FindExpensesCriteria
} from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';
import { MixUpdateExpenseService } from '../../../adapters/gateways/';
import {
  FindBankCriteria,
  IBankRepository
} from '../../../domains/bank/interfaces';
import { UpdateBankData } from '../../../domains/bank/interfaces';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';

export class UpdateExpenseGateway
  extends MixUpdateExpenseService
  implements IUpdateExpenseGateway
{
  expenseRepository: IExpenseRepository;
  bankRepository: IBankRepository;

  constructor(params: UpdateExpenseGatewayParams) {
    super(params);
    this.expenseRepository = params.repository;
    this.bankRepository = params.bankRepository;
  }

  async findExpense(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | undefined> {
    return await this.expenseRepository.find(criteria);
  }

  async updateExpense(criteria: UpdateExpenseData): Promise<boolean> {
    return await this.expenseRepository.update(criteria);
  }
  async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
    return await this.bankRepository.find(criteria);
  }
  async updateBank(criteria: UpdateBankData): Promise<boolean> {
    return await this.bankRepository.update(criteria);
  }
}
