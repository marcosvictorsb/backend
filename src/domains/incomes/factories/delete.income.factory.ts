import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { DeleteIncomeInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { GetIncomesGatewayParams } from '../interfaces';
import { DeleteIncomeController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { DeleteIncomeGateway } from '../gateways';


const incomeRepository = new IncomeRepository({ model: IncomeModel });

const gateway: GetIncomesGatewayParams = {
  repository: incomeRepository,
  logger
}

const IncomeGateway = new DeleteIncomeGateway(gateway);
const presenter = new Presenter();
const interactor = new DeleteIncomeInteractor(IncomeGateway, presenter);
export const deleteIncomeController = new DeleteIncomeController({ interactor });