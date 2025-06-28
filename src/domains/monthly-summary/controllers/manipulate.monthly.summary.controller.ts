import { Request, Response } from 'express';
import { ManipulateMonthlySummaryInteractor } from '../usecases/manipulate.monthly.summary.interactor';
import {
  ManipulateMonthlySummaryControllerParams,
  InputManipulateMonthlySummary
} from '../interfaces/manipulate.monthly.summary.interface';

interface IManipulateMonthlySummaryController {
  manipulateMonthlySummary(request: Request, response: Response): Promise<Response>;
}

export class ManipulateMonthlySummaryController implements IManipulateMonthlySummaryController {
  protected interactor: ManipulateMonthlySummaryInteractor;

  constructor(params: ManipulateMonthlySummaryControllerParams) {
    this.interactor = params.interactor;
  }

  public async manipulateMonthlySummary(request: Request, response: Response): Promise<Response> {
    const input: InputManipulateMonthlySummary = {
      userId: Number(request?.user?.id),
      referenceMonth: request.body.reference_month,
      amount: Number(request.body.amount),
      type: request.body.type,
      operation: request.body.operation || 'add'
    };

    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
