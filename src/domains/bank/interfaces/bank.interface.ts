import { ModelStatic } from 'sequelize';
import { BankEntity } from '../entities/bank.entity';
import BankModel from '../model/bank.model';

export type CreateBankCriteria = {
  name: string;
  amount: number;
  id_user: number;
};

export type FindBankCriteria = {
  id?: number;
  name?: string;
  amount?: number;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type DeleteBankData = {
  id?: number;
  name?: string;
  amount?: number;
  id_user?: number;
};

export type UpdateBankData = {
  id?: number;
  name?: string;
  amount?: number;
  id_user?: number;
};

export type IBankRepositoryDependencies = {
  model: ModelStatic<BankModel>;
};

export interface IBankRepository {
  create(data: CreateBankCriteria): Promise<BankEntity>;
  find(criteria: FindBankCriteria): Promise<BankEntity | undefined>;
  findAll(criteria: FindBankCriteria): Promise<BankEntity[] | null>;
  delete(criteria: DeleteBankData): Promise<boolean>;
  update(criteria: UpdateBankData): Promise<boolean>;
}
