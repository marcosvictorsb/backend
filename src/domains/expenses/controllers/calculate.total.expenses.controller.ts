import { Request, Response } from 'express';
import { CalculateTotalExpensesInteractor } from '../usecases/calculate.total.expenses.interactor';
import {
  CalculateTotalExpensesControllerParams,
  InputCalculateTotalExpenses
} from '../interfaces/';

interface ICalculateTotalExpensesController {
  calculateTotalExpenses(
    request: Request,
    response: Response
  ): Promise<Response>;
}

export class CalculateTotalExpensesController
  implements ICalculateTotalExpensesController
{
  protected interactor: CalculateTotalExpensesInteractor;

  constructor(params: CalculateTotalExpensesControllerParams) {
    this.interactor = params.interactor;
  }

  public async calculateTotalExpenses(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputCalculateTotalExpenses = {
      id_user: Number(request.user?.id),
      reference_month: request.query.reference_month as string
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
