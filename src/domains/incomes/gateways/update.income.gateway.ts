import { IIncomeRepository, IUpdateIncomeGateway, UpdateIncomeGatewayParams, UpdateIncomeData } from '../interfaces';
import { IncomeEntity } from '../entity/income.entity';
import { MixUpdateIncomeService } from '../../../adapters/gateways/';

export class UpdateIncomeGateway extends MixUpdateIncomeService implements IUpdateIncomeGateway {
  IncomeRepository: IIncomeRepository;

  constructor(params: UpdateIncomeGatewayParams) {
    super(params);
    this.IncomeRepository = params.repository;
  }

  async updateIncome(criteria: UpdateIncomeData): Promise<boolean> {
    return await this.IncomeRepository.update(criteria);
  }
}
