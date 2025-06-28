import { ModelStatic } from 'sequelize';
import MonthlySummaryModel from '../model/monthly.summary.model';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';

export type FindMonthlySummaryCriteria = {
  id?: number;
  reference_month?: string;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  dateCreateStart?: Date;
  dateCreateEnd?: Date;
};

export type CreateMonthlySummaryCriteria = {
  reference_month: string;
  total_incomes: number;
  total_expenses: number;
  balance: number;
  id_user: number;
};

export type UpdateMonthlySummaryData = {
  reference_month?: string;
  total_incomes?: number;
  total_expenses?: number;
  balance?: number;
};

export type DeleteMonthlySummaryData = {
  id: number;
};

export type IMonthlySummaryRepositoryDependencies = {
  model: ModelStatic<MonthlySummaryModel>;
};

export interface IMonthlySummaryRepository {
  create(data: CreateMonthlySummaryCriteria): Promise<MonthlySummaryEntity>;
  findById(id: number): Promise<MonthlySummaryEntity | null>;
  findAll(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity[]>;
  findOne(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity | null>;
  update(
    id: number,
    data: UpdateMonthlySummaryData
  ): Promise<MonthlySummaryEntity | null>;
  delete(id: number): Promise<boolean>;
  findByUserAndMonth(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity | null>;
}
