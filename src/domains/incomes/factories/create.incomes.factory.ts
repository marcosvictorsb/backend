
import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomesInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { CreateIncomesGatewayParams } from '../interfaces';
import { CreateIncomesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CreateIncomesGateway } from '../gateways/create.incomes.gateway';


const incomeRepository = new IncomeRepository({ model: IncomeModel });

const gateway: CreateIncomesGatewayParams = {
  repository: incomeRepository,
  logger
}

const IncomeGateway = new CreateIncomesGateway(gateway);
const presenter = new Presenter();
const interactor = new CreateIncomesInteractor(IncomeGateway, presenter);
export const createIncomesController = new CreateIncomesController({ interactor });
