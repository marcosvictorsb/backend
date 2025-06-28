import { Request, Response } from 'express';
import { GetMonthlySummaryInteractor } from '../usecases/get.monthly.summary.interactor';
import {
  GetMonthlySummaryControllerParams,
  InputGetMonthlySummary
} from '../interfaces/get.monthly.summary.interface';
import { IPresenter } from '../../../protocols/presenter';

interface IGetMonthlySummaryController {
  getMonthlySummary(request: Request, response: Response): Promise<Response>;
}

export class GetMonthlySummaryController
  implements IGetMonthlySummaryController
{
  protected interactor: GetMonthlySummaryInteractor;
  protected presenter: IPresenter;

  constructor(
    params: GetMonthlySummaryControllerParams & { presenter: IPresenter }
  ) {
    this.interactor = params.interactor;
    this.presenter = params.presenter;
  }

  public async getMonthlySummary(
    request: Request,
    response: Response
  ): Promise<Response> {
    try {
      const input: InputGetMonthlySummary = {
        id_user: Number(request?.user?.id),
        reference_month: request.query.reference_month as string
      };

      const result = await this.interactor.execute(input);
      const httpResponse = this.presenter.OK(result);
      return response.status(httpResponse.status).json(httpResponse.body);
    } catch (error: any) {
      const httpResponse =
        error.message === 'Resumo mensal não encontrado'
          ? this.presenter.notFound(error.message)
          : this.presenter.serverError('Erro interno do servidor');
      return response.status(httpResponse.status).json(httpResponse.body);
    }
  }
}
