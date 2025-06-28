import { Request, Response } from 'express';
import { CreateMonthlySummaryInteractor } from '../usecases/create.monthly.summary.interactor';
import {
  CreateMonthlySummaryControllerParams,
  InputCreateMonthlySummary
} from '../interfaces/create.monthly.summary.interface';

interface ICreateMonthlySummaryController {
  createMonthlySummary(request: Request, response: Response): Promise<Response>;
}

export class CreateMonthlySummaryController implements ICreateMonthlySummaryController {
  protected interactor: CreateMonthlySummaryInteractor;

  constructor(params: CreateMonthlySummaryControllerParams) {
    this.interactor = params.interactor;
  }

  public async createMonthlySummary(request: Request, response: Response): Promise<Response> {
    const input: InputCreateMonthlySummary = {
      reference_month: request.body.reference_month,
      id_user: Number(request?.user?.id),
      amount: request.body.amount
    };

    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
