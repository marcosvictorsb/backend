import logger from '../../../config/logger';
import { BankRepository } from '../repositories/bank.repository';
import { GetBanksInteractor } from '../usecases';
import BankModel from '../model/bank.model';
import { GetBanksGatewayParams } from '../interfaces';
import { GetBanksController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { GetBanksGateway } from '../gateways';

const bankRepository = new BankRepository({ model: BankModel });
const gateway: GetBanksGatewayParams = {
  repository: bankRepository,
  logger
};
const bankGateway = new GetBanksGateway(gateway);
const presenter = new Presenter();
const interactor = new GetBanksInteractor(bankGateway, presenter);
export const getBanksController = new GetBanksController({ interactor });
