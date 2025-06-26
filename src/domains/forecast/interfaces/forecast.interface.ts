export interface ExpenseDTO {
  id: string;
  amount: number;
  description: string;
  bankName: string;
}

export interface DayForecastDTO {
  date: string; // formato YYYY-MM-DD
  expenses: ExpenseDTO[];
  totalSpent: number;
  available: number; // quanto ainda poderia gastar nesse dia, considerando sobras anteriores
  color: "green" | "yellow" | "red";
}

export interface FinancialForecastDTO {
  incomeTotal: number;
  dailyLimit: number;
  days: DayForecastDTO[];
}

export interface InputForecast {
  userId: string;
  referenceMonth: string; // formato YYYY-MM
}
