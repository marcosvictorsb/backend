import logger from '../../../config/logger';
import { IncomeRepository } from '../repositories/income.repository';
import { CalculateTotalIncomesInteractor } from '../usecases';
import IncomeModel from '../model/income.model';
import { CalculateTotalIncomesGatewayParams } from '../interfaces';
import { CalculateTotalIncomesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CalculateTotalIncomesGateway } from '../gateways/';

const incomeRepository = new IncomeRepository({ model: IncomeModel });

const gateway: CalculateTotalIncomesGatewayParams = {
  repository: incomeRepository,
  logger
};

const calculateGateway = new CalculateTotalIncomesGateway(gateway);
const presenter = new Presenter();
const interactor = new CalculateTotalIncomesInteractor(
  calculateGateway,
  presenter
);
export const calculateTotalIncomesController =
  new CalculateTotalIncomesController({ interactor });
