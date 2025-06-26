import { ModelStatic } from 'sequelize';
import IncomeModel from '../model/income.model';
import { CreateIncomesCriteria } from './create.incomes.interface';
import { IncomeEntity } from '../entity/income.entity';
import { DeleteIncomeData } from './delete.income.interface';
import { UpdateIncomeData } from './update.income.interface';

export type FindIncomesCriteria = {
  id?: number;
  description?: string;
  amount?: number;
  reference_month?: string;
  status?: string;
  id_user?: number;
  id_bank?: number;
  date_received?: Date;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  dateCreateStart?: Date;
  dateCreateEnd?: Date;
};

export type IIncomeRepositoryDependencies = {
  model: ModelStatic<IncomeModel>;
};

export type IncomeOutput = {
  amount: number;
  description: string;
  reference_month: string;
  status: string;
};

export enum IncomeStatus {
  RECEIVED = 'Recebido',
  PENDING = 'Aguardando Receber'
}

export interface IIncomeRepository {
  create(data: CreateIncomesCriteria): Promise<IncomeEntity>;
  find(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined>;
  findAll(criteria: FindIncomesCriteria): Promise<IncomeEntity[]>;
  delete(criteria: DeleteIncomeData): Promise<boolean>;
  update(criteria: UpdateIncomeData): Promise<boolean>;
}
