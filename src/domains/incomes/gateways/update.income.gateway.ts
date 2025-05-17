import { IIncomeRepository, IUpdateIncomeGateway, UpdateIncomeGatewayParams, UpdateIncomeData, FindIncomesCriteria } from '../interfaces';
import { IncomeEntity } from '../entity/income.entity';
import { MixUpdateIncomeService } from '../../../adapters/gateways/';
import { FindBankCriteria, IBankRepository, UpdateBankData } from '../../../domains/bank/interfaces';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';

export class UpdateIncomeGateway extends MixUpdateIncomeService implements IUpdateIncomeGateway {
  incomeRepository: IIncomeRepository;
  bankRepository: IBankRepository

  constructor(params: UpdateIncomeGatewayParams) {
    super(params);
    this.incomeRepository = params.repository;
    this.bankRepository = params.bankRepository
  }
  async findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined> {
    return await this.incomeRepository.find(criteria);
  }

  async updateIncome(criteria: UpdateIncomeData): Promise<boolean> {
    return await this.incomeRepository.update(criteria);
  }

  async findBank(criteria: FindBankCriteria): Promise<BankEntity | undefined> {
    return await this.bankRepository.find(criteria);
  }
  async updateBank(criteria: UpdateBankData): Promise<boolean> {
    return await this.bankRepository.update(criteria);
  }
}
