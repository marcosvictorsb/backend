import logger from '../../../config/logger';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import { FindMonthlySummaryCriteria, IMonthlySummaryRepository } from './monthly.summary.interface';
import { DataLogOutput } from '../../../adapters/services';

export enum OperationType {
  Add = 'add',
  Dubtract = 'subtract'
}

export enum ManipulateMonthlySummaryType {
  Income = 'income',
  Expense = 'expense'
}

export type InputManipulateMonthlySummary = {
  userId: number;
  referenceMonth: string;
  amount: number;
  type: ManipulateMonthlySummaryType;
  operation: OperationType;
};

export type ManipulateMonthlySummaryData = {
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

export type ManipulateMonthlySummaryGatewayParams = {
  repository: IMonthlySummaryRepository;
  logger: typeof logger;
};

export type ManipulateMonthlySummaryControllerParams = {
  interactor: any; // Will be defined after creating the interactor
};

export interface IManipulateMonthlySummaryGateway {
  manipulateMonthlySummary(params: InputManipulateMonthlySummary): Promise<MonthlySummaryEntity>;
  findByUserAndMonth(userId: number, referenceMonth: string): Promise<MonthlySummaryEntity | null>;
  createNewSummary(userId: number, referenceMonth: string): Promise<MonthlySummaryEntity>;
  updateSummary(summary: MonthlySummaryEntity, amount: number, type: 'income' | 'expense', operation: 'add' | 'subtract'): Promise<MonthlySummaryEntity>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
