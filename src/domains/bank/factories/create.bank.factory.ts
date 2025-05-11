
import logger from '../../../config/logger';
import { BankRepository } from '../repositories/bank.repository';
import { CreateBankInteractor } from '../usecases';
import BankModel from '../model/bank.model';
import { CreateBankGatewayParams } from '../interfaces';
import { CreateBankController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CreateBankGateway } from '../gateways';


const bankRepository = new BankRepository({ model: BankModel });

const gateway: CreateBankGatewayParams = {
  repository: bankRepository,
  logger
}

const bankGateway = new CreateBankGateway(gateway);
const presenter = new Presenter();
const interactor = new CreateBankInteractor(bankGateway, presenter);
export const createBanksController = new CreateBankController({ interactor });
