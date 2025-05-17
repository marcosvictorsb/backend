import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { GetIncomesInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { GetIncomesGatewayParams } from '../interfaces';
import { GetIncomesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { GetIncomesGateway } from '../gateways/get.incomes.gateway';

const incomeRepository = new IncomeRepository({ model: IncomeModel });

const gateway: GetIncomesGatewayParams = {
  repository: incomeRepository,
  logger
};

const IncomeGateway = new GetIncomesGateway(gateway);
const presenter = new Presenter();
const interactor = new GetIncomesInteractor(IncomeGateway, presenter);
export const getIncomesController = new GetIncomesController({ interactor });
