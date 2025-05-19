import { ModelStatic } from 'sequelize';
import ExpenseModel from '../model/expense.model';
import { CreateExpensesCriteria } from './create.expenses.interface';
import { ExpenseEntity } from '../entity/expenses.entity';
import { DeleteExpenseData } from './delete.expense.interface';
import { UpdateExpenseData } from './update.expense.interface';

export type FindExpensesCriteria = {
  id?: number;
  description?: string;
  amount?: number;
  reference_month?: string;
  status?: string;
  id_user?: number;
  id_bank?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  createdStart?: string;
  createdEnd?: string;
  date_payment?: Date;
  datePaymentStart?: Date;
  datePaymentEnd?: Date;
};

export type IExpenseRepositoryDependencies = {
  model: ModelStatic<ExpenseModel>;
};

export type ExpenseOutput = {
  amount: number;
  description: string;
  reference_month: string;
  status: string;
};

export enum ExpenseStatus {
  PAID = 'Pago',
  PENDING = 'Pendente'
}

export interface IExpenseRepository {
  create(data: CreateExpensesCriteria): Promise<ExpenseEntity>;
  find(criteria: FindExpensesCriteria): Promise<ExpenseEntity | undefined>;
  findAll(criteria: FindExpensesCriteria): Promise<ExpenseEntity[]>;
  delete(criteria: DeleteExpenseData): Promise<boolean>;
  update(criteria: UpdateExpenseData): Promise<boolean>;
}
