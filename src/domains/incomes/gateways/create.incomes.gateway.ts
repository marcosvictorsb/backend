import {
  IIncomeRepository,
  ICreateIncomesGateway,
  CreateIncomesGatewayParams,
  CreateIncomesCriteria
} from '../interfaces';
import { MixCreateIncomesService } from '../../../adapters/gateways';
import { FindIncomesCriteria } from '../interfaces/incomes';
import { IncomeEntity } from '../entity/income.entity';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';
import {
  FindBankCriteria,
  IBankRepository,
  UpdateBankData
} from '../../../domains/bank/interfaces';

export class CreateIncomesGateway
  extends MixCreateIncomesService
  implements ICreateIncomesGateway
{
  incomesRepository: IIncomeRepository;
  bankRepository: IBankRepository;

  constructor(params: CreateIncomesGatewayParams) {
    super(params);
    this.incomesRepository = params.repository;
    this.bankRepository = params.bankRepository;
  }

  async createIncomes(data: CreateIncomesCriteria): Promise<IncomeEntity> {
    return await this.incomesRepository.create(data);
  }

  async findIncomes(
    criteria: FindIncomesCriteria
  ): Promise<IncomeEntity | undefined> {
    return await this.incomesRepository.find(criteria);
  }

  async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
    return await this.bankRepository.find(criteria);
  }

  async updateBank(criteria: UpdateBankData): Promise<boolean> {
    return await this.bankRepository.update(criteria);
  }
}
