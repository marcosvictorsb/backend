import { IIncomeRepository, IDeleteIncomeGateway, DeleteIncomeGatewayParams, DeleteIncomeData, FindIncomesCriteria } from '../interfaces';
import { IncomeEntity } from '../entity/income.entity';
import { MixDeleteIncomeService } from '../../../adapters/gateways';
import { FindBankCriteria, UpdateBankData, IBankRepository } from '../../../domains/bank/interfaces';
import { BankEntity } from '../../../domains/bank/entities/bank.entity';

export class DeleteIncomeGateway extends MixDeleteIncomeService implements IDeleteIncomeGateway {
  IncomeRepository: IIncomeRepository;
  bankRepository: IBankRepository;

  constructor(params: DeleteIncomeGatewayParams) {
    super(params);
    this.IncomeRepository = params.repository;
    this.bankRepository = params.bankRepository
  }

  async deleteIncome(data: DeleteIncomeData): Promise<boolean> {
    return await this.IncomeRepository.delete(data);
  }

  async findIncome(criteria: FindIncomesCriteria): Promise<IncomeEntity | undefined> {
    return await this.IncomeRepository.find(criteria);
  }

  async findBank(criteria: FindBankCriteria): Promise<BankEntity  | undefined> {
    return await this.bankRepository.find(criteria);
  }

  async updateBank(criteria: UpdateBankData): Promise<boolean> {
    return await this.bankRepository.update(criteria);
  }
}
