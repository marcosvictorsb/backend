export interface MonthlySummaryEntityParams {
  id?: number;
  reference_month: string;
  total_incomes: number;
  total_expenses: number;
  balance: number;
  id_user: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export class MonthlySummaryEntity {
  public readonly id?: number;
  public readonly reference_month: string;
  public readonly total_incomes: number;
  public readonly total_expenses: number;
  public readonly balance: number;
  public readonly id_user: number;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
  public readonly deleted_at?: Date;

  constructor(params: MonthlySummaryEntityParams) {
    this.id = params.id;
    this.reference_month = params.reference_month;
    this.total_incomes = params.total_incomes;
    this.total_expenses = params.total_expenses;
    this.balance = params.balance;
    this.id_user = params.id_user;
    this.created_at = params.created_at;
    this.updated_at = params.updated_at;
    this.deleted_at = params.deleted_at;
  }

  static fromModel(model: any): MonthlySummaryEntity {
    const params: MonthlySummaryEntityParams = {
      id: model.id,
      reference_month: model.reference_month,
      total_incomes: model.total_incomes,
      total_expenses: model.total_expenses,
      balance: model.balance,
      id_user: model.id_user,
      created_at: model.created_at,
      updated_at: model.updated_at,
      deleted_at: model.deleted_at
    };
    return new MonthlySummaryEntity(params);
  }

  static calculateBalance(totalIncomes: number, totalExpenses: number): number {
    return totalIncomes - totalExpenses;
  }

  static formatReferenceMonth(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }

  static getCurrentReferenceMonth(): string {
    return this.formatReferenceMonth(new Date());
  }

  static validateReferenceMonth(referenceMonth: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(referenceMonth);
  }

  static getPreviousReferenceMonth(referenceMonth: string): string {
    const [month, year] = referenceMonth.split('/').map(Number);
    let previousMonth = month - 1;
    let previousYear = year;

    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear = year - 1;
    }

    return `${String(previousMonth).padStart(2, '0')}/${previousYear}`;
  }

  toJSON() {
    return {
      id: this.id,
      reference_month: this.reference_month,
      total_incomes: this.total_incomes,
      total_expenses: this.total_expenses,
      balance: this.balance,
      id_user: this.id_user,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at
    };
  }
}
