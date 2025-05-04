import { IExpenseRepository, ICreateExpensesGateway, CreateExpensesGatewayParams, CreateExpensesCriteria } from '../interfaces';
import { MixCreateExpensesService } from '../../../adapters/gateways/';
import { FindExpensesCriteria } from '../interfaces/expenses';
import { ExpenseEntity } from '../entity/expenses.entity';

export class CreateExpensesGateway extends MixCreateExpensesService implements ICreateExpensesGateway {
  expensesRepository: IExpenseRepository;

  constructor(params: CreateExpensesGatewayParams) {
    super(params);
    this.expensesRepository = params.repository;
  }

  async createExpenses(data: CreateExpensesCriteria): Promise<ExpenseEntity> {
    return await this.expensesRepository.create(data);
  }

  async findExpenses(criteria: FindExpensesCriteria): Promise<ExpenseEntity | null> {
    return await this.expensesRepository.find(criteria);
  }
}
