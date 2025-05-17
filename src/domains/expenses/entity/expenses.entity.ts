export class ExpenseEntity {
  public readonly id: number;
  public readonly amount: number;
  public readonly description: string;
  public readonly reference_month: string;
  public readonly type?: string;
  public readonly status: string;
  public readonly id_user: number;
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
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  }) {
    this.id = params.id;
    this.amount = params.amount;
    this.description = params.description;
    this.reference_month = params.reference_month;
    this.type = params?.type || 'despesa';
    this.status = params.status;
    this.id_user = params.id_user;
    this.created_at = params?.created_at;
    this.updated_at = params?.updated_at;
    this.deleted_at = params?.deleted_at;
  }

  static fromModel(model: any): ExpenseEntity {
    const params = {
      id: model.id,
      amount: model.amount,
      description: model.description,
      reference_month: model.reference_month,
      type: model.type || 'despesa',
      status: model.status,
      id_user: model.id_user,
      created_at: model.created_at,
      updated_at: model.updated_at,
      deleted_at: model.deleted_at
    };
    return new ExpenseEntity(params);
  }

  static formatReferenceMonth(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
