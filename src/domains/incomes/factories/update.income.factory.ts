import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { UpdateIncomeInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { UpdateIncomeGatewayParams } from '../interfaces';
import { UpdateIncomeController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { UpdateIncomeGateway } from '../gateways';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';
import BankModel from '../../../domains/bank/model/bank.model';


const incomeRepository = new IncomeRepository({ model: IncomeModel });
const bankRepository = new BankRepository({ model: BankModel })


const gateway: UpdateIncomeGatewayParams = {
  repository: incomeRepository,
  bankRepository,
  logger
}

const IncomeGateway = new UpdateIncomeGateway(gateway);
const presenter = new Presenter();
const interactor = new UpdateIncomeInteractor(IncomeGateway, presenter);
export const updateIncomesController = new UpdateIncomeController({ interactor });