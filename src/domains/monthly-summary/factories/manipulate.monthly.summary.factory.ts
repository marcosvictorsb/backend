import logger from '../../../config/logger';
import { MonthlySummaryRepository } from '../repositories/monthly.summary.repository';
import { ManipulateMonthlySummaryGateway } from '../gateways/manipulate.monthly.summary.gateway';
import { ManipulateMonthlySummaryInteractor } from '../usecases/manipulate.monthly.summary.interactor';
import { ManipulateMonthlySummaryController } from '../controllers/manipulate.monthly.summary.controller';
import { Presenter } from '../../../protocols/presenter';
import MonthlySummaryModel from '../model/monthly.summary.model';
import { ManipulateMonthlySummaryGatewayParams } from '../interfaces/manipulate.monthly.summary.interface';

const monthlySummaryRepository = new MonthlySummaryRepository({ model: MonthlySummaryModel });

const gateway: ManipulateMonthlySummaryGatewayParams = {
  repository: monthlySummaryRepository,
  logger
};

const manipulateMonthlySummaryGateway = new ManipulateMonthlySummaryGateway(gateway);
const presenter = new Presenter();
const interactor = new ManipulateMonthlySummaryInteractor(manipulateMonthlySummaryGateway, presenter);

const manipulateMonthlySummaryController =
  new ManipulateMonthlySummaryController({ interactor });

export {
  manipulateMonthlySummaryController,
  interactor as manipulateMonthlySummaryInteractor
};
