import { Request, Response } from 'express';
import { CalculateTotalIncomesInteractor } from '../usecases/calculate.total.incomes.interactor';
import {
  CalculateTotalIncomesControllerParams,
  InputCalculateTotalIncomes
} from '../interfaces/';

interface ICalculateTotalIncomesController {
  calculateTotalIncomes(
    request: Request,
    response: Response
  ): Promise<Response>;
}

export class CalculateTotalIncomesController
  implements ICalculateTotalIncomesController
{
  protected interactor: CalculateTotalIncomesInteractor;

  constructor(params: CalculateTotalIncomesControllerParams) {
    this.interactor = params.interactor;
  }

  public async calculateTotalIncomes(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputCalculateTotalIncomes = {
      id_user: Number(request.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
