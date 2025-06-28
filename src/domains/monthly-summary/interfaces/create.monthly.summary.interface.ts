import logger from '../../../config/logger';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import {
  FindMonthlySummaryCriteria,
  IMonthlySummaryRepository,
  UpdateMonthlySummaryData
} from './monthly.summary.interface';
import { DataLogOutput } from '../../../adapters/services';

export type InputCreateMonthlySummary = {
  reference_month: string;
  id_user: number;
  amount: number;
};

export type CreateMonthlySummaryData = {
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

export type CreateMonthlySummaryGatewayParams = {
  repository: IMonthlySummaryRepository;
  logger: typeof logger;
};

export type CreateMonthlySummaryControllerParams = {
  interactor: any; // Will be defined after creating the interactor
};

export interface ICreateMonthlySummaryGateway {
  create(data: any): Promise<MonthlySummaryEntity>;
  findByUserAndMonth(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity | null>;
  calculateTotalsFromTransactions(
    userId: number,
    referenceMonth: string
  ): Promise<{
    totalIncomes: number;
    totalExpenses: number;
    balance: number;
  }>;
  updateMonthlySummary(
    data: UpdateMonthlySummaryData,
    criteria: FindMonthlySummaryCriteria
  ): Promise<boolean>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
