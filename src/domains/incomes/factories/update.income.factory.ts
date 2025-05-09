import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { UpdateIncomeInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { UpdateIncomeGatewayParams } from '../interfaces';
import { UpdateIncomeController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { UpdateIncomeGateway } from '../gateways';


const incomeRepository = new IncomeRepository({ model: IncomeModel });

const gateway: UpdateIncomeGatewayParams = {
  repository: incomeRepository,
  logger
}

const IncomeGateway = new UpdateIncomeGateway(gateway);
const presenter = new Presenter();
const interactor = new UpdateIncomeInteractor(IncomeGateway, presenter);
export const updateIncomesController = new UpdateIncomeController({ interactor });