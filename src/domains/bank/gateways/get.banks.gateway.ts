import {
  IBankRepository,
  IGetBanksGateway,
  GetBanksGatewayParams,
  GetBanksData,
  FindBankCriteria
} from '../interfaces/';
import { BankEntity } from '../entities/bank.entity';
import { MixGetBanksService } from '../../../adapters/gateways/get.banks.gateway';

export class GetBanksGateway
  extends MixGetBanksService
  implements IGetBanksGateway
{
  bankRepository: IBankRepository;

  constructor(params: GetBanksGatewayParams) {
    super(params);
    this.bankRepository = params.repository;
  }

  async getBanks(criteria: FindBankCriteria): Promise<BankEntity[] | null> {
    return await this.bankRepository.findAll(criteria);
  }
}
