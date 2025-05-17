import {
  IIncomeRepository,
  IGetIncomesGateway,
  GetIncomesGatewayParams,
  FindIncomesCriteria
} from '../interfaces';
import { IncomeEntity } from '../entity/income.entity';
import { MixGetIncomesService } from '../../../adapters/gateways/';

export class GetIncomesGateway
  extends MixGetIncomesService
  implements IGetIncomesGateway
{
  IncomesRepository: IIncomeRepository;

  constructor(params: GetIncomesGatewayParams) {
    super(params);
    this.IncomesRepository = params.repository;
  }

  async getIncomes(
    criteria: FindIncomesCriteria
  ): Promise<IncomeEntity[] | undefined> {
    return await this.IncomesRepository.findAll(criteria);
  }
}
