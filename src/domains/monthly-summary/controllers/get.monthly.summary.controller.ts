import { Request, Response } from 'express';
import { GetMonthlySummaryInteractor } from '../usecases/get.monthly.summary.interactor';
import {
  GetMonthlySummaryControllerParams,
  InputGetMonthlySummary
} from '../interfaces/get.monthly.summary.interface';

interface IGetMonthlySummaryController {
  getMonthlySummary(request: Request, response: Response): Promise<Response>;
}

export class GetMonthlySummaryController implements IGetMonthlySummaryController {
  protected interactor: GetMonthlySummaryInteractor;

  constructor(params: GetMonthlySummaryControllerParams) {
    this.interactor = params.interactor;
  }

  public async getMonthlySummary(request: Request, response: Response): Promise<Response> {
    const input: InputGetMonthlySummary = {
      id_user: Number(request?.user?.id),
      reference_month: request.query.reference_month as string
    };

    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
