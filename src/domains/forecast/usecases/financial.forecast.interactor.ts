import { IForecastGateway } from '../interfaces/forecast.gateway.interface';
import {
  FinancialForecastDTO,
  InputForecast,
  ExpenseDTO,
  IncomeDTO,
  DayForecastDTO
} from '../interfaces/forecast.interface';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { ExpenseStatus } from '../../expenses/interfaces/expenses';
import { IncomeStatus } from '../../incomes/interfaces/incomes';

export class FinancialForecastInteractor {
  constructor(
    private readonly gateway: IForecastGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputForecast): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando previsão financeira', {
        input: JSON.stringify(input)
      });

      const { userId, referenceMonth } = input;
      const userIdNumber = parseInt(userId);

      // Parse do mês de referência
      const { year, month } = this.parseReferenceMonth(referenceMonth);
      const daysInMonth = new Date(year, month, 0).getDate();

      // 1. Buscar saldo inicial dos bancos
      const banks = await this.gateway.findBanksByUser(userIdNumber);
      const initialBalance = banks.reduce((sum, bank) => sum + bank.amount, 0);

      // 2. Buscar receitas do mês
      const incomes = await this.gateway.findIncomesByUserAndMonth(
        userIdNumber,
        referenceMonth
      );

      // 3. Buscar despesas do mês
      const expenses = await this.gateway.findExpensesByUserAndMonth(
        userIdNumber,
        referenceMonth
      );

      // Agrupar receitas e despesas por dia
      const incomesByDay = this.groupTransactionsByDay(
        incomes,
        year,
        month,
        'income'
      );
      const expensesByDay = this.groupTransactionsByDay(
        expenses,
        year,
        month,
        'expense'
      );

      // Gerar previsão diária no formato da planilha
      const days = this.generateDailyForecast(
        incomesByDay,
        expensesByDay,
        year,
        month,
        daysInMonth,
        initialBalance
      );

      // Calcular totais como na planilha
      const totalIncome = days.reduce((sum, day) => sum + day.income, 0);
      const totalExpense = days.reduce((sum, day) => sum + day.expense, 0);
      const performance = totalIncome - totalExpense;

      const result: FinancialForecastDTO = {
        initialBalance,
        totalIncome,
        totalExpense,
        performance,
        days
      };

      this.gateway.loggerInfo('Previsão financeira calculada com sucesso');
      return this.presenter.OK(result);
    } catch (error) {
      this.gateway.loggerError('Erro ao calcular previsão financeira', error);
      return this.presenter.serverError('Erro ao calcular previsão financeira');
    }
  }

  private parseReferenceMonth(referenceMonth: string): {
    year: number;
    month: number;
  } {
    let year: number, month: number;

    if (referenceMonth.includes('-')) {
      // Formato: YYYY-MM
      [year, month] = referenceMonth.split('-').map(Number);
    } else if (referenceMonth.includes('/')) {
      // Formato: MM/YYYY
      const [monthStr, yearStr] = referenceMonth.split('/');
      month = parseInt(monthStr);
      year = parseInt(yearStr);
    } else {
      throw new Error(`Formato de referenceMonth inválido: ${referenceMonth}`);
    }

    return { year, month };
  }

  private groupTransactionsByDay(
    transactions: any[],
    year: number,
    month: number,
    type: 'income' | 'expense'
  ): Map<string, (IncomeDTO | ExpenseDTO)[]> {
    const transactionsByDay = new Map<string, (IncomeDTO | ExpenseDTO)[]>();

    transactions.forEach((transaction) => {
      const transactionDate =
        type === 'expense'
          ? transaction.date_payment
          : transaction.date_received;
      if (!transactionDate) return;

      const date = new Date(transactionDate);
      const dateStr = date.toISOString().split('T')[0];
      const transactionYear = date.getFullYear();
      const transactionMonth = date.getMonth() + 1;

      if (transactionYear === year && transactionMonth === month) {
        if (!transactionsByDay.has(dateStr)) {
          transactionsByDay.set(dateStr, []);
        }

        const dto =
          type === 'income'
            ? ({
                id: transaction.id.toString(),
                amount: transaction.amount,
                description: transaction.description,
                bankName: transaction.bank?.name || 'Banco não informado',
                status: transaction.status,
                date: dateStr
              } as IncomeDTO)
            : ({
                id: transaction.id.toString(),
                amount: transaction.amount,
                description: transaction.description,
                bankName: transaction.bank?.name || 'Banco não informado',
                status: transaction.status,
                date: dateStr
              } as ExpenseDTO);

        transactionsByDay.get(dateStr)!.push(dto);
      }
    });

    return transactionsByDay;
  }

  private generateDailyForecast(
    incomesByDay: Map<string, IncomeDTO[]>,
    expensesByDay: Map<string, ExpenseDTO[]>,
    year: number,
    month: number,
    daysInMonth: number,
    initialBalance: number
  ): DayForecastDTO[] {
    const days: DayForecastDTO[] = [];
    let runningBalance = initialBalance;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;

      // Processar receitas do dia
      const dayIncomes = incomesByDay.get(dateStr) || [];
      const income = dayIncomes.reduce((sum, inc) => sum + inc.amount, 0);

      // Processar despesas do dia
      const dayExpenses = expensesByDay.get(dateStr) || [];
      const expense = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Calcular saldo acumulado (igual à planilha)
      runningBalance += income - expense;

      // Listar descrições dos gastos (como na coluna "Gastos" da planilha)
      const expensesDescription = dayExpenses
        .map((e) => e.description)
        .join('; ');

      days.push({
        date: dateStr,
        income,
        expense,
        runningBalance,
        expensesDescription,
        // Opcional: incluir detalhes completos se necessário
        incomes: dayIncomes,
        expenses: dayExpenses
      });
    }

    return days;
  }
}