import { IForecastGateway } from '../interfaces/forecast.gateway.interface';
import { FinancialForecastDTO, InputForecast, ExpenseDTO, DayForecastDTO } from '../interfaces/forecast.interface';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { ExpenseStatus } from '../../expenses/interfaces/expenses';

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

      // Buscar valores reais dos bancos (receitas efetivamente recebidas)
      const banks = await this.gateway.findBanksByUser(userIdNumber);

      // Buscar despesas do mês
      const expenses = await this.gateway.findExpensesByUserAndMonth(
        userIdNumber,
        referenceMonth
      );

      // Filtrar apenas despesas pagas
      const paidExpenses = expenses.filter(
        (expense) => expense.status === ExpenseStatus.PAID
      );

      // Calcular receita total baseada nos valores reais dos bancos
      const incomeTotal = banks.reduce((sum, bank) => sum + bank.amount, 0);

      // O referenceMonth pode vir no formato YYYY-MM ou MM/YYYY
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
        throw new Error(
          `Formato de referenceMonth inválido: ${referenceMonth}`
        );
      }

      const daysInMonth = new Date(year, month, 0).getDate();

      // Calcular limite diário
      const dailyLimit = incomeTotal / daysInMonth;

      // Agrupar gastos por dia
      const expensesByDay = this.groupExpensesByDay(paidExpenses, year, month);

      // Gerar previsão para cada dia do mês
      const days = this.generateDailyForecast(
        expensesByDay,
        year,
        month,
        daysInMonth,
        dailyLimit
      );

      const result: FinancialForecastDTO = {
        incomeTotal,
        dailyLimit,
        days
      };

      this.gateway.loggerInfo(
        'Previsão financeira calculada com sucesso baseada nos valores dos bancos'
      );
      return this.presenter.OK(result);
    } catch (error) {
      this.gateway.loggerError('Erro ao calcular previsão financeira', error);
      return this.presenter.serverError('Erro ao calcular previsão financeira');
    }
  }

  private groupExpensesByDay(expenses: any[], year: number, month: number): Map<string, ExpenseDTO[]> {
    const expensesByDay = new Map<string, ExpenseDTO[]>();

    expenses.forEach((expense) => {
      const expenseDate = expense.date_payment;
      if (!expenseDate) {
        return;
      }

      const dateStr = new Date(expenseDate).toISOString().split('T')[0];
      // Verificar se a data pertence ao mês de referência
      const expenseYear = new Date(expenseDate).getFullYear();
      const expenseMonth = new Date(expenseDate).getMonth() + 1;

      if (expenseYear === year && expenseMonth === month) {
        if (!expensesByDay.has(dateStr)) {
          expensesByDay.set(dateStr, []);
        }

        const expenseDTO: ExpenseDTO = {
          id: expense.id.toString(),
          amount: expense.amount,
          description: expense.description,
          bankName: expense.bank?.name || 'Banco não informado'
        };

        expensesByDay.get(dateStr)!.push(expenseDTO);
      } else {
      }
    });

    return expensesByDay;
  }

  private generateDailyForecast(
    expensesByDay: Map<string, ExpenseDTO[]>, 
    year: number, 
    month: number, 
    daysInMonth: number, 
    dailyLimit: number
  ): DayForecastDTO[] {
    const days: DayForecastDTO[] = [];
    let accumulatedAvailable = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayExpenses = expensesByDay.get(dateStr) || [];
      const totalSpent = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      // Calcular disponível considerando sobras dos dias anteriores
      const dailyAvailable = dailyLimit + accumulatedAvailable;
      const remainingAfterSpending = dailyAvailable - totalSpent;
      
      // Atualizar acumulado para o próximo dia
      accumulatedAvailable = Math.max(0, remainingAfterSpending);

      // Calcular cor baseada no uso do limite diário
      const color = this.calculateDayColor(totalSpent, dailyLimit);

      days.push({
        date: dateStr,
        expenses: dayExpenses,
        totalSpent,
        available: Math.max(0, remainingAfterSpending),
        color
      });
    }

    return days;
  }

  private calculateDayColor(totalSpent: number, dailyLimit: number): "green" | "yellow" | "red" {
    const usagePercentage = totalSpent / dailyLimit;
    
    if (usagePercentage <= 0.7) {
      return "green";
    } else if (usagePercentage <= 1.0) {
      return "yellow";
    } else {
      return "red";
    }
  }
}
