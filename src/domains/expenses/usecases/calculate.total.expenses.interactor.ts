import {
  CalculateTotalExpensesData,
  ExpenseStatus,
  FindExpensesCriteria,
  ICalculateTotalExpensesGateway
} from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputCalculateTotalExpenses } from '../interfaces/';
import { ExpenseEntity } from '../entity/expenses.entity';

export class CalculateTotalExpensesInteractor {
  constructor(
    private readonly gateway: ICalculateTotalExpensesGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputCalculateTotalExpenses): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo(
        'Iniciou a requisição para buscar a soma do total de despesa',
        {
          input: JSON.stringify(input)
        }
      );
      const { id_user } = input;

      const criteria: FindExpensesCriteria = {
        id_user,
        reference_month: this.formatMonthYear(new Date())
      };

      const expenses = await this.gateway.findExpenses(criteria);
      if (!expenses) {
        this.gateway.loggerInfo(
          'Não tem valor cadatrado, então será necessário retornar o valor 0'
        );
        return this.presenter.OK({ total: 0 });
      }     

      const total = this.getTotalExpense(expenses);

      return this.presenter.OK({ 
        total_expense_pay: total.total_expense_pay,
        total_expense_to_pay: total.total_expense_to_pay 
      });
    } catch (error) {
      this.gateway.loggerError('Erro ao realizar o calculo das despesas', {
        error
      });
      return this.presenter.serverError(
        'Erro ao realizar o calculo das despesas'
      );
    }
  }

  private getTotalExpense(expenses: ExpenseEntity[]): { 
    total_expense_pay: number,
    total_expense_to_pay: number
   } {
    let total_expense_pay: number = 0;
    let total_expense_to_pay: number = 0;
    for(let i = 0; i <= expenses.length - 1; i++) {
      if(expenses[i].status === ExpenseStatus.PAID) {
        total_expense_pay += expenses[i].amount;
        continue
      }
      total_expense_to_pay += expenses[i].amount;
    }

    return {
      total_expense_pay,
      total_expense_to_pay
    }
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
