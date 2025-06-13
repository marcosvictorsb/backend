import {
  ExpenseOutput,
  ExpenseStatus,
  FindExpensesCriteria,
  ICreateExpensesGateway,
  InputCreateExpenses
} from '../interfaces';
import { IPresenter, HttpResponse } from '../../../protocols';

export class CreateExpensesInteractor {
  constructor(
    private readonly gateway: ICreateExpensesGateway,
    private presenter: IPresenter
  ) {}

  async execute(inputs: InputCreateExpenses[]): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Criando registros de despesas em lote', {
        count: inputs.length,
        requestTxt: JSON.stringify(inputs)
      });

      const results = await this.processExpenses(inputs);

      if (results.createdCount === 0) {
        this.gateway.loggerInfo('Nenhuma despesa foi criada', {
          existingCount: results.existingCount
        });
        return this.presenter.conflict(
          'Nenhuma despesa foi criada (todas já existiam)'
        );
      }

      await this.updateBanksForPaidExpenses(results.createdExpenses);

      this.gateway.loggerInfo('Despesas criadas com sucesso', {
        createdCount: results.createdCount,
        existing: results.existingCount
      });

      return this.presenter.created({
        created: results.createdCount,
        existing: results.existingCount,
        expenses: results.createdExpenses
      });
    } catch (error) {
      this.gateway.loggerError('Erro ao criar despesas em lote', { error });
      return this.presenter.serverError('Erro ao criar despesas em lote');
    }
  }

  private async processExpenses(inputs: InputCreateExpenses[]): Promise<{
    createdExpenses: ExpenseOutput[];
    createdCount: number;
    existingCount: number;
  }> {
    const createdExpenses: ExpenseOutput[] = [];
    let existingCount = 0;

    for (const input of inputs) {
      const expenses = input.is_recurring
        ? await this.createRecurringExpenses(input)
        : await this.createSingleExpense(input);

      if (expenses.length === 0) {
        existingCount++;
        continue;
      }

      createdExpenses.push(...expenses);
    }

    return {
      createdExpenses,
      createdCount: createdExpenses.length,
      existingCount
    };
  }

  private async updateBanksForPaidExpenses(
    expenses: ExpenseOutput[]
  ): Promise<void> {
    const paidExpenses = expenses.filter(
      (e) => e.status.toLowerCase() === ExpenseStatus.PAID.toLowerCase()
    );
    const bankUpdates: Record<number, number> = {};

    // Agrupar atualizações por banco
    for (const expense of paidExpenses) {
      if (!expense.id_bank) continue;

      bankUpdates[expense.id_bank] =
        (bankUpdates[expense.id_bank] || 0) - Number(expense.amount);
    }

    // Processar atualizações em lote
    for (const [bankId, amountChange] of Object.entries(bankUpdates)) {
      const bank = await this.gateway.findBank({ id: Number(bankId) });
      if (!bank) continue;

      await this.gateway.updateBank({
        id: bank.id,
        amount: bank.amount + amountChange
      });
      this.gateway.loggerInfo(
        `Banco: ${bank.name}, valor: ${(bank.amount / 100).toFixed(
          2
        )} atualizado para: ${(bank.amount + amountChange).toFixed(2)}`
      );
    }
  }

  private async createRecurringExpenses(
    input: InputCreateExpenses
  ): Promise<ExpenseOutput[]> {
    this.gateway.loggerInfo('Criando despensa recorrente');
    const {
      amount,
      description,
      id_user,
      recurring_count,
      status,
      id_bank,
      date_payment
    } = input;
    const reference_month = new Date();
    const expenses: ExpenseOutput[] = [];
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

      if (await this.gateway.findExpenses(criteria)) {
        this.gateway.loggerInfo('Despesa recorrente já existe', {
          requestTxt: JSON.stringify(criteria)
        });
        continue;
      }

      const expense = await this.gateway.createExpenses({
        amount,
        description,
        id_user,
        reference_month: this.formatMonthYear(month),
        status: index === firstExpense ? status : 'pendente',
        id_bank,
        date_payment:
          status.toLowerCase() === ExpenseStatus.PAID.toLowerCase()
            ? date_payment
            : undefined
      });

      this.gateway.loggerInfo('Despesa criada: ', {
        expense: JSON.stringify(expense)
      });

      expenses.push(this.mapExpenseOutput(expense));
    }

    return expenses;
  }

  private async createSingleExpense(
    input: InputCreateExpenses
  ): Promise<ExpenseOutput[]> {
    this.gateway.loggerInfo('Não é um despesa recorrente');
    const { amount, description, id_user, status, id_bank, date_payment } =
      input;

    const expense = await this.gateway.createExpenses({
      amount,
      description,
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      status,
      id_bank,
      date_payment:
        status.toLowerCase() === ExpenseStatus.PAID.toLowerCase()
          ? date_payment
          : undefined
    });
    this.gateway.loggerInfo('Despesa criada: ', {
      expense: JSON.stringify(expense)
    });

    return [this.mapExpenseOutput(expense)];
  }

  private mapExpenseOutput(expense: any): ExpenseOutput {
    return {
      amount: expense.amount,
      description: expense.description,
      reference_month: expense.reference_month,
      status: expense.status,
      id_bank: expense.id_bank,
      date_payment: expense.date_payment
    };
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}