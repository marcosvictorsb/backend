export class IncomeEntity {
  public readonly id: number;
  public readonly amount: number;
  public readonly description: string;
  public readonly reference_month: string;
  public readonly type?: string;
  public readonly status: string;
  public readonly id_user: number;
  public readonly id_bank: number;
  public readonly date_received?: Date;
  public readonly created_at?: Date;
  public readonly updated_at?: Date;
  public readonly deleted_at?: Date;

  constructor(params: {
    id: number;
    amount: number;
    description: string;
    reference_month: string;
    type?: string;
    status: string;
    id_user: number;
    id_bank: number;
    date_received?: Date;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  }) {
    this.id = params.id;
    this.amount = params.amount;
    this.description = params.description;
    this.reference_month = params.reference_month;
    this.type = params?.type || 'receita';
    this.status = params.status;
    this.id_user = params.id_user;
    this.id_bank = params.id_bank;
    this.date_received = params?.date_received;
    this.created_at = params?.created_at;
    this.updated_at = params?.updated_at;
    this.deleted_at = params?.deleted_at;
  }

  static fromModel(model: any): IncomeEntity {
    const params = {
      id: model.id,
      amount: model.amount,
      description: model.description,
      reference_month: model.reference_month,
      type: model.type || 'despesa',
      status: model.status,
      id_user: model.id_user,
      id_bank: model.id_bank,
      created_at: model.created_at,
      updated_at: model.updated_at,
      deleted_at: model.deleted_at
    };
    return new IncomeEntity(params);
  }

  static formatReferenceMonth(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
