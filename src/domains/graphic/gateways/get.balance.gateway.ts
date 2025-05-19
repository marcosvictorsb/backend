import {
  IBalanceRepository,
  IGetBalanceGateway,
  GetBalanceGatewayParams,
  GetBalanceData
} from '../interfaces/';
import { BalanceEntity } from '../entities/balance.entity';
import { MixGetBalanceService } from '../../../adapters/gateways/get.balance.gateway';

export class GetBalanceGateway
  extends MixGetBalanceService
  implements IGetBalanceGateway
{
  balanceRepository: IBalanceRepository;

  constructor(params: GetBalanceGatewayParams) {
    super();
    this.balanceRepository = params.repository;
  }

  async getBalance(data: GetBalanceData): Promise<BalanceEntity> {
    return this.balanceRepository.create(data);
  }
}
