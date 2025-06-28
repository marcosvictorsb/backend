import logger from '../../../config/logger';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import { FindMonthlySummaryCriteria, IMonthlySummaryRepository } from './monthly.summary.interface';
import { DataLogOutput } from '../../../adapters/services';

export type InputGetMonthlySummary = {
  id_user: number;
  reference_month?: string;
};

export type GetMonthlySummaryData = {
  id?: number;
  reference_month?: string;
  total_incomes?: number;
  total_expenses?: number;
  balance?: number;
  id_user?: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type MonthlySummaryResult = {
  reference_month: string;
  total_incomes: number;
  total_expenses: number;
  balance: number;
  initial_balance?: number;
};

export type MonthlySummaryListResult = {
  summaries: MonthlySummaryResult[];
};

export type GetMonthlySummaryGatewayParams = {
  repository: IMonthlySummaryRepository;
  logger: typeof logger;
};

export type GetMonthlySummaryControllerParams = {
  interactor: any; // Will be defined after creating the interactor
};

export interface IGetMonthlySummaryGateway {
  findAll(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity[]>;
  findByUserAndMonth(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity | null>;
  findPreviousMonthBalance(
    userId: number,
    referenceMonth: string
  ): Promise<number>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
