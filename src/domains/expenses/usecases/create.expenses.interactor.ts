import {
  ExpenseOutput,
  ExpenseStatus,
  FindExpensesCriteria,
  ICreateExpensesGateway
} from '../interfaces';
import { IPresenter, HttpResponse } from '../../../protocols';
import { InputCreateExpenses } from '../interfaces';
import { FindBankCriteria, UpdateBankData } from '../../../domains/bank/interfaces';

export class CreateExpensesInteractor {
  constructor(
    private readonly gateway: ICreateExpensesGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputCreateExpenses): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Criando registros de despesas', {
        requestTxt: JSON.stringify(input)
      });
      const { is_recurring, id_bank, amount, status  } = input;

      const expenses = is_recurring
        ? await this.createRecurringExpenses(input)
        : await this.createSingleExpense(input);

      if (!expenses.length) {
        this.gateway.loggerInfo('Registro de despesa não criado', {
          requestTxt: JSON.stringify(input)
        });
        return this.presenter.conflict(
          'Registros de despesa já cadastrado anteriormente'
        );
      }

      const bankCriteria: FindBankCriteria = {
        id: id_bank
      };

      if (status === ExpenseStatus.PAID) {
        const bank = await this.gateway.findBank(bankCriteria);
        if (!bank) {
          this.gateway.loggerInfo('Banco não encontrado', {
            requestTxt: JSON.stringify(bank)
          });
          return this.presenter.notFound('Banco não encontrado');
        }
        const updatedAmount = bank.amount - Number(amount);
        const criteriaUpdate: UpdateBankData = {
          amount: updatedAmount,
          id: bank.id
        };
        await this.gateway.updateBank(criteriaUpdate);
      }

      this.gateway.loggerInfo('Registros de despesas criados com sucesso', {
        requestTxt: JSON.stringify(expenses)
      });
      return this.presenter.created(expenses);
    } catch (error) {
      this.gateway.loggerError('Erro ao criar despesas', { error });
      return this.presenter.serverError('Erro ao criar despesas');
    }
  }

  private async createRecurringExpenses(
    input: InputCreateExpenses
  ): Promise<ExpenseOutput[]> {
    const { amount, description, id_user, recurring_count, status, id_bank } = input;
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
        description
      };
      const expenseExists = await this.gateway.findExpenses(criteria);
      if (expenseExists) {
        this.gateway.loggerInfo('Registro de despesa já existe', {
          requestTxt: JSON.stringify(expenseExists)
        });
        continue;
      }

      const data = {
        amount,
        description,
        id_user,
        is_recurring: true,
        reference_month: this.formatMonthYear(month),
        status: index === firstExpense ? status : 'pendente',
        id_bank
      };

      const expense = await this.gateway.createExpenses(data);
      expenses.push({
        amount: expense.amount,
        description: expense.description,
        reference_month: expense.reference_month,
        status: expense.status,
        id_bank: expense.id_bank
      });
    }

    return expenses;
  }

  private async createSingleExpense(
    input: InputCreateExpenses
  ): Promise<ExpenseOutput[]> {
    const { amount, description, id_user, status, id_bank } = input;

    const criteria: FindExpensesCriteria = {
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      amount,
      description
    };
    const expenseExists = await this.gateway.findExpenses(criteria);
    if (expenseExists) {
      this.gateway.loggerInfo('Registro de despesa já existe', {
        requestTxt: JSON.stringify(expenseExists)
      });
      return [];
    }

    const data = {
      amount,
      description,
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      status,
      id_bank
    };

    const expense = await this.gateway.createExpenses(data);
    return [
      {
        amount: expense.amount,
        description: expense.description,
        reference_month: expense.reference_month,
        status: expense.status
      }
    ];
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
