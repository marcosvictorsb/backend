import { IIncomeRepository, ICalculateTotalIncomesGateway, CalculateTotalIncomesGatewayParams, CalculateTotalIncomesData, FindIncomesCriteria } from '../interfaces/';
import { IncomeEntity } from '../entity/income.entity';
import { MixCalculateTotalIncomesService } from '../../../adapters/gateways/incomes/calculate.total.incomes.gateway';

export class CalculateTotalIncomesGateway extends MixCalculateTotalIncomesService implements ICalculateTotalIncomesGateway {
  incomeRepository: IIncomeRepository;

  constructor(params: CalculateTotalIncomesGatewayParams) {
    super(params);
    this.incomeRepository = params.repository;
  }

  async findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity[] | undefined> {
    return await this.incomeRepository.findAll(criteria);
  }
}
