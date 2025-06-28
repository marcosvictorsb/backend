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

  async findAll(criteria: FindMonthlySummaryCriteria): Promise<MonthlySummaryEntity[]> {
    return await this.monthlySummaryRepository.findAll(criteria);
  }

  async findByUserAndMonth(userId: number, referenceMonth: string): Promise<MonthlySummaryEntity | null> {
    return await this.monthlySummaryRepository.findByUserAndMonth(userId, referenceMonth);
  }
}
