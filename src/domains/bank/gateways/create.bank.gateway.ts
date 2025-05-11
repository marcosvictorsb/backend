import { BankEntity } from '../entities/bank.entity';
import { MixCreateBankService } from '../../../adapters/gateways';
import { FindBankCriteria, IBankRepository, ICreateBankGateway, CreateBankGatewayParams, CreateBankCriteria } from '../interfaces';

export class CreateBankGateway extends MixCreateBankService implements ICreateBankGateway {
  bankRepository: IBankRepository;

  constructor(params: CreateBankGatewayParams) {
    super(params);
    this.bankRepository = params.repository;
  }

  async createBank(data: CreateBankCriteria): Promise<BankEntity> {
    return await this.bankRepository.create(data);
  }

   async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
    return await this.bankRepository.find(criteria);
  }
}
