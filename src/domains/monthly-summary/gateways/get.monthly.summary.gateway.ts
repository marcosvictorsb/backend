import {
  IGetMonthlySummaryGateway,
  GetMonthlySummaryGatewayParams,
  GetMonthlySummaryData
} from '../interfaces/get.monthly.summary.interface';
import { IMonthlySummaryRepository, FindMonthlySummaryCriteria } from '../interfaces/monthly.summary.interface';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';
import { DataLogOutput } from '../../../adapters/services';

export class GetMonthlySummaryGateway implements IGetMonthlySummaryGateway {
  monthlySummaryRepository: IMonthlySummaryRepository;
  private logger: any;

  constructor(params: GetMonthlySummaryGatewayParams) {
    this.monthlySummaryRepository = params.repository;
    this.logger = params.logger;
  }

  loggerInfo(message: string, data?: DataLogOutput): void {
    this.logger.info(message, data);
  }

  loggerError(message: string, data?: DataLogOutput): void {
    this.logger.error(message, data);
  }

  async findAll(
    criteria: FindMonthlySummaryCriteria
  ): Promise<MonthlySummaryEntity[]> {
    return await this.monthlySummaryRepository.findAll(criteria);
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

  async findPreviousMonthBalance(
    userId: number,
    referenceMonth: string
  ): Promise<number> {
    // Usar o método estático da entidade para calcular o mês anterior
    const previousReferenceMonth =
      MonthlySummaryEntity.getPreviousReferenceMonth(referenceMonth);

    // Buscar o resumo do mês anterior
    const previousSummary =
      await this.monthlySummaryRepository.findByUserAndMonth(
        userId,
        previousReferenceMonth
      );

    // Se não existe resumo do mês anterior, retorna 0
    return previousSummary ? previousSummary.balance : 0;
  }
}
