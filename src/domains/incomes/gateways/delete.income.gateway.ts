import { IIncomeRepository, IDeleteIncomeGateway, DeleteIncomeGatewayParams, DeleteIncomeData, FindIncomesCriteria } from '../interfaces';
import { IncomeEntity } from '../entity/income.entity';
import { MixDeleteIncomeService } from '../../../adapters/gateways';

export class DeleteIncomeGateway extends MixDeleteIncomeService implements IDeleteIncomeGateway {
  IncomeRepository: IIncomeRepository;

  constructor(params: DeleteIncomeGatewayParams) {
    super(params);
    this.IncomeRepository = params.repository;
  }

  async deleteIncome(data: DeleteIncomeData): Promise<boolean> {
    return await this.IncomeRepository.delete(data);
  }

  async findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | null> {
    return await this.IncomeRepository.find(criteria);
  }
}
