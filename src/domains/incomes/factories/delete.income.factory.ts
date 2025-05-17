import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { DeleteIncomeInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { DeleteIncomeGatewayParams } from '../interfaces';
import { DeleteIncomeController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { DeleteIncomeGateway } from '../gateways';
import BankModel from '../../../domains/bank/model/bank.model';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';


const incomeRepository = new IncomeRepository({ model: IncomeModel });
const bankRepository = new BankRepository({ model: BankModel })

const gateway: DeleteIncomeGatewayParams = {
  repository: incomeRepository,
  bankRepository: bankRepository,
  logger
}

const incomeGateway = new DeleteIncomeGateway(gateway);
const presenter = new Presenter();
const interactor = new DeleteIncomeInteractor(incomeGateway, presenter);
export const deleteIncomeController = new DeleteIncomeController({ interactor });