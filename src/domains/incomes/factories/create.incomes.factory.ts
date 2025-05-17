
import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomesInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { CreateIncomesGatewayParams } from '../interfaces';
import { CreateIncomesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CreateIncomesGateway } from '../gateways/create.incomes.gateway';
import { BankRepository } from '../../../domains/bank/repositories/bank.repository';
import BankModel from '../../../domains/bank/model/bank.model';


const incomeRepository = new IncomeRepository({ model: IncomeModel });
const bankRepository = new BankRepository({ model: BankModel })

const gateway: CreateIncomesGatewayParams = {
  repository: incomeRepository,
  bankRepository: bankRepository,
  logger
}

const incomeGateway = new CreateIncomesGateway(gateway);
const presenter = new Presenter();
const interactor = new CreateIncomesInteractor(incomeGateway, presenter);
export const createIncomesController = new CreateIncomesController({ interactor });
