import { IIncomeRepository, ICreateIncomesGateway, CreateIncomesGatewayParams, CreateIncomesCriteria } from '../interfaces';
import { MixCreateIncomesService } from '../../../adapters/gateways';
import { FindIncomesCriteria } from '../interfaces/incomes';
import { IncomeEntity } from '../entity/income.entity';

export class CreateIncomesGateway extends MixCreateIncomesService implements ICreateIncomesGateway {
  IncomesRepository: IIncomeRepository;

  constructor(params: CreateIncomesGatewayParams) {
    super(params);
    this.IncomesRepository = params.repository;
  }

  async createIncomes(data: CreateIncomesCriteria): Promise<IncomeEntity> {
    return await this.IncomesRepository.create(data);
  }

  async findIncomes(criteria: FindIncomesCriteria): Promise<IncomeEntity | null> {
    return await this.IncomesRepository.find(criteria);
  }
}
