import { IForecastRepository } from '../interfaces';
import { IncomeEntity } from '../../incomes/entity/income.entity';
import { ExpenseEntity } from '../../expenses/entity/expenses.entity';
import { BankEntity } from '../../bank/entities/bank.entity';
import { IIncomeRepository } from '../../incomes/interfaces/incomes';
import { IExpenseRepository } from '../../expenses/interfaces/expenses';
import { IBankRepository } from '../../bank/interfaces';

export interface ForecastRepositoryParams {
  incomeRepository: IIncomeRepository;
  expenseRepository: IExpenseRepository;
  bankRepository: IBankRepository;
}

export class ForecastRepository implements IForecastRepository {
  private incomeRepository: IIncomeRepository;
  private expenseRepository: IExpenseRepository;
  private bankRepository: IBankRepository;

  constructor(params: ForecastRepositoryParams) {
    this.incomeRepository = params.incomeRepository;
    this.expenseRepository = params.expenseRepository;
    this.bankRepository = params.bankRepository;
  }

  async findIncomesByUserAndMonth(userId: number, referenceMonth: string): Promise<IncomeEntity[]> {
    return this.incomeRepository.findAll({
      id_user: userId,
      reference_month: referenceMonth
    });
  }

  async findExpensesByUserAndMonth(userId: number, referenceMonth: string): Promise<ExpenseEntity[]> {
    return this.expenseRepository.findAll({
      id_user: userId,
      reference_month: referenceMonth
    });
  }

  async findBanksByUser(userId: number): Promise<BankEntity[]> {
    const banks = await this.bankRepository.findAll({
      id_user: userId
    });
    return banks || [];
  }
}
