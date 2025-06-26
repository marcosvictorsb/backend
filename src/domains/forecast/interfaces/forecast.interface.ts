export interface ExpenseDTO {
  id: string;
  amount: number;
  description: string;
  bankName: string;
  status: string;
  date: string; // formato YYYY-MM-DD
}

export interface DayForecastDTO {
  date: string; // Data no formato YYYY-MM-DD
  income: number; // Soma das entradas do dia
  expense: number; // Soma das saídas do dia
  runningBalance: number; // Saldo acumulado
  expensesDescription: string; // Descrição dos gastos (separados por "; ")
  incomes?: IncomeDTO[]; // Opcional: detalhes das receitas
  expenses?: ExpenseDTO[]; // Opcional: detalhes das despesas
}

export interface FinancialForecastDTO {
  initialBalance: number; // Saldo inicial (dos bancos)
  totalIncome: number; // Total de entradas no mês
  totalExpense: number; // Total de saídas no mês
  performance: number; // Diferença entre entradas e saídas
  days: DayForecastDTO[]; // Previsão diária
}

export interface InputForecast {
  userId: string;
  referenceMonth: string; // formato YYYY-MM
}

export interface IncomeDTO {
  id: string;
  amount: number;
  description: string;
  bankName: string;
  status: string;
  date: string;
}

