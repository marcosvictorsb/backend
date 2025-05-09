import { ModelStatic } from "sequelize";
import IncomeModel from "../model/income.model";
import { CreateIncomesCriteria } from "./create.incomes.interface";
import { IncomeEntity } from "../entity/income.entity";
import { DeleteIncomeData } from "./delete.income.interface";
import { UpdateIncomeData } from "./update.income.interface";

export type FindIncomesCriteria = {
  id?: number;
  description?: string;
  amount?: number;
  reference_month?: string;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export type IIncomeRepositoryDependencies = {
  model: ModelStatic<IncomeModel>
}


export type IncomeOutput = {
  amount: number;
  description: string;
  reference_month: string;
  status: string;
}


export interface IIncomeRepository {
  create(data: CreateIncomesCriteria): Promise<IncomeEntity>;
  find(criteria: FindIncomesCriteria): Promise<IncomeEntity | null>;
  findAll(criteria: FindIncomesCriteria): Promise<IncomeEntity[] | null>;
  delete(criteria: DeleteIncomeData): Promise<boolean>;
  update(criteria: UpdateIncomeData): Promise<boolean>;
}