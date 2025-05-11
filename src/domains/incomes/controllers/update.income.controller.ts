import { Request, Response } from 'express';
import { UpdateIncomeInteractor } from '../usecases/update.incomes.interactor';
import { UpdateIncomeControllerParams } from '../interfaces';

interface IUpdateIncomeController {
  updateIncome(request: Request, response: Response): Promise<Response>;
}

export class UpdateIncomeController implements IUpdateIncomeController {
  protected interactor: UpdateIncomeInteractor;

  constructor(params: UpdateIncomeControllerParams) {
    this.interactor = params.interactor;
  }

  public async updateIncome(request: Request, response: Response): Promise<Response> {
    const result = await this.interactor.execute(request.body);
    return response.status(result.status).json(result.body);
  }
}
