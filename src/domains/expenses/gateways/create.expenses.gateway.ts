import {
  IExpenseRepository,
  ICreateExpensesGateway,
  CreateExpensesGatewayParams,
  CreateExpensesCriteria
} from '../interfaces';
import { MixCreateExpensesService } from '../../../adapters/gateways/';
import { FindExpensesCriteria } from '../interfaces/expenses';
import { ExpenseEntity } from '../entity/expenses.entity';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import { FindBankCriteria, UpdateBankData } from '../../../domains/bank/interfaces';
import { IBankRepository } from '../../../domains/bank/interfaces';

export class CreateExpensesGateway
  extends MixCreateExpensesService
  implements ICreateExpensesGateway
{
  expensesRepository: IExpenseRepository;
  bankRepository: IBankRepository;

  constructor(params: CreateExpensesGatewayParams) {
    super(params);
    this.expensesRepository = params.repository;
    this.bankRepository = params.bankRepository;
  }  

  async createExpenses(data: CreateExpensesCriteria): Promise<ExpenseEntity> {
    return await this.expensesRepository.create(data);
  }

  async findExpenses(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | undefined> {
    return await this.expensesRepository.find(criteria);
  }

  async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
     return await this.bankRepository.find(criteria);
   }
 
   async updateBank(criteria: UpdateBankData): Promise<boolean> {
     return await this.bankRepository.update(criteria);
   }
}
