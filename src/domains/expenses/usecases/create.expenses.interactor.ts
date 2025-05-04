import { FindExpensesCriteria, ICreateExpensesGateway } from '../interfaces';
import { IPresenter, HttpResponse } from '../../../protocols';
import { InputCreateExpenses } from '../interfaces';

export class CreateExpensesInteractor {
  constructor(private readonly gateway: ICreateExpensesGateway, private presenter: IPresenter) {}

  async execute(input: InputCreateExpenses): Promise<HttpResponse> {   
    try {
      this.gateway.loggerInfo('Criando registros de despesas', { requestTxt: JSON.stringify(input)} );
      const { is_recurring } = input;

      const expenses = is_recurring
        ? await this.createRecurringExpenses(input)
        : await this.createSingleExpense(input);

      if (Array.isArray(expenses) && expenses.length === 0) {
        this.gateway.loggerInfo('Registro de despesa não criado', { requestTxt: JSON.stringify(input)});
        return this.presenter.conflict('Registros de despesa já cadastrado anteriormente');
      }

      this.gateway.loggerInfo('Registros de despesas criados com sucesso', { requestTxt: JSON.stringify(expenses)});
      return this.presenter.created(expenses);
    } catch (error) {
      console.log(error);
      this.gateway.loggerError('Erro ao criar despesas', { error });
      return this.presenter.serverError('Erro ao criar despesas');
    }
  }

  private async createRecurringExpenses(input: InputCreateExpenses) {
    const { amount, description, id_user, recurring_count, status } = input;
    const reference_month = new Date();
    const expenses = [];
    const firstExpense = 0;

    for (let index = 0; index < (recurring_count ?? 0); index++) {
      const month = new Date(reference_month);
      month.setMonth(reference_month.getMonth() + index);       

      const criteria: FindExpensesCriteria = {
        id_user,
        reference_month: this.formatMonthYear(month),
        amount,
        description,
      };
      const expenseExists = await this.gateway.findExpenses(criteria);
      if (expenseExists) {
        this.gateway.loggerInfo('Registro de despesa já existe', { requestTxt: JSON.stringify(expenseExists)});
        continue;
      }

      const data = {
        amount,
        description,
        id_user,
        is_recurring: true,
        reference_month: this.formatMonthYear(month),
        status: index === firstExpense ? status : 'pendente'
      };

      const expense = await this.gateway.createExpenses(data);
      expenses.push({
        amount: expense.amount,
			  description: expense.description,
			  reference_month: expense.reference_month,
        status: expense.status,
      });
    }

    return expenses;
  }

  private async createSingleExpense(input: InputCreateExpenses) {
    const { amount, description, id_user, status } = input;

    const criteria: FindExpensesCriteria = {
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      amount,
      description,
    };
    const expenseExists = await this.gateway.findExpenses(criteria);
    if (expenseExists) {
      this.gateway.loggerInfo('Registro de despesa já existe', { requestTxt: JSON.stringify(expenseExists)});
      return [];
    }

    const data = {
      amount,
      description,
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      status
    };

    const expense = await this.gateway.createExpenses(data);
    return {
      amount: expense.amount,
      description: expense.description,
      reference_month: expense.reference_month,
      status: expense.status,
    };
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
