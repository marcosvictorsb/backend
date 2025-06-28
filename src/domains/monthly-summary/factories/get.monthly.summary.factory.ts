import logger from '../../../config/logger';
import { MonthlySummaryRepository } from '../repositories/monthly.summary.repository';
import { GetMonthlySummaryGateway } from '../gateways/get.monthly.summary.gateway';
import { GetMonthlySummaryInteractor } from '../usecases/get.monthly.summary.interactor';
import { GetMonthlySummaryController } from '../controllers/get.monthly.summary.controller';
import { Presenter } from '../../../protocols/presenter';
import MonthlySummaryModel from '../model/monthly.summary.model';
import { GetMonthlySummaryGatewayParams } from '../interfaces/get.monthly.summary.interface';

const monthlySummaryRepository = new MonthlySummaryRepository({ model: MonthlySummaryModel });

const gateway: GetMonthlySummaryGatewayParams = {
  repository: monthlySummaryRepository,
  logger
};

const getMonthlySummaryGateway = new GetMonthlySummaryGateway(gateway);
const presenter = new Presenter();
const interactor = new GetMonthlySummaryInteractor(getMonthlySummaryGateway, presenter);

export const getMonthlySummaryController = new GetMonthlySummaryController({ interactor });
