import { ModelStatic } from "sequelize";
import ExpenseModel from "../model/expense.model";
import { CreateExpensesCriteria } from "./create.expenses.interface";
import { ExpenseEntity } from "../entity/expenses.entity";
import { DeleteExpenseData } from "./delete.expense.interface";
import { UpdateExpenseData } from "./update.expense.interface";

export type FindExpensesCriteria = {
  id?: number;
  description?: string;
  amount?: number;
  reference_month?: string;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  createdStart?: Date
  createdEnd?: Date
}

export type IExpenseRepositoryDependencies = {
  model: ModelStatic<ExpenseModel>
}


export type ExpenseOutput = {
  amount: number;
  description: string;
  reference_month: string;
  status: string;
}


export interface IExpenseRepository {
  create(data: CreateExpensesCriteria): Promise<ExpenseEntity>;
  find(criteria: FindExpensesCriteria): Promise<ExpenseEntity | null>;
  findAll(criteria: FindExpensesCriteria): Promise<ExpenseEntity[] | null>;
  delete(criteria: DeleteExpenseData): Promise<boolean>;
  update(criteria: UpdateExpenseData): Promise<boolean>;
}