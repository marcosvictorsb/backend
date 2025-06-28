import {
  IManipulateMonthlySummaryGateway,
  ManipulateMonthlySummaryGatewayParams,
  InputManipulateMonthlySummary,
  ManipulateMonthlySummaryType,
  OperationType
} from '../interfaces/manipulate.monthly.summary.interface';
import { IMonthlySummaryRepository } from '../interfaces/monthly.summary.interface';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import { DataLogOutput } from '../../../adapters/services';

export class ManipulateMonthlySummaryGateway
  implements IManipulateMonthlySummaryGateway
{
  monthlySummaryRepository: IMonthlySummaryRepository;
  private logger: any;

  constructor(params: ManipulateMonthlySummaryGatewayParams) {
    this.monthlySummaryRepository = params.repository;
    this.logger = params.logger;
  }

  loggerInfo(message: string, data?: DataLogOutput): void {
    this.logger.info(message, data);
  }

  loggerError(message: string, data?: DataLogOutput): void {
    this.logger.error(message, data);
  }

  async findByUserAndMonth(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity | null> {
    return await this.monthlySummaryRepository.findByUserAndMonth(
      userId,
      referenceMonth
    );
  }

  async manipulateMonthlySummary(
    params: InputManipulateMonthlySummary
  ): Promise<MonthlySummaryEntity> {
    const { userId, referenceMonth, amount, type, operation } = params;

    let summary = await this.findByUserAndMonth(userId, referenceMonth);
    if (!summary) {
      summary = await this.createNewSummary(userId, referenceMonth);
    }

    // Atualizar o resumo com o novo valor
    return await this.updateSummary(summary, amount, type, operation);
  }

  async createNewSummary(
    userId: number,
    referenceMonth: string
  ): Promise<MonthlySummaryEntity> {
    const newSummaryData = {
      reference_month: referenceMonth,
      total_incomes: 0,
      total_expenses: 0,
      balance: 0,
      id_user: userId
    };

    return await this.monthlySummaryRepository.create(newSummaryData);
  }

  async updateSummary(
    summary: MonthlySummaryEntity,
    amount: number,
    type: ManipulateMonthlySummaryType,
    operation: OperationType
  ): Promise<MonthlySummaryEntity> {
    const currentIncomes = summary.total_incomes;
    const currentExpenses = summary.total_expenses;

    let newIncomes = currentIncomes;
    let newExpenses = currentExpenses;

    // Aplicar a operação baseada no tipo
    if (type === ManipulateMonthlySummaryType.Income) {
      if (operation === OperationType.Add) {
        newIncomes += amount;
      } else {
        newIncomes -= amount;
      }
    } else if (type === ManipulateMonthlySummaryType.Expense) {
      if (operation === OperationType.Add) {
        newExpenses += amount;
      } else {
        newExpenses -= amount;
      }
    }

    // // Garantir que os valores não sejam negativos
    // newIncomes = Math.max(0, newIncomes);
    // newExpenses = Math.max(0, newExpenses);

    // Calcular novo balance
    const newBalance = newIncomes - newExpenses;

    // Atualizar no banco
    const updatedSummary = await this.monthlySummaryRepository.update(
      summary.id!,
      {
        total_incomes: newIncomes,
        total_expenses: newExpenses,
        balance: newBalance
      }
    );

    if (!updatedSummary) {
      throw new Error('Falha ao atualizar o resumo mensal');
    }

    return updatedSummary;
  }
}
