import { Request, Response } from 'express';
import { GetExpensesInteractor } from '../usecases/get.expenses.interactor';
import { GetExpensesControllerParams, InputGetExpenses } from '../interfaces/';

interface IGetExpensesController {
  getExpenses(request: Request, response: Response): Promise<Response>;
}

export class GetExpensesController implements IGetExpensesController {
  protected interactor: GetExpensesInteractor;

  constructor(params: GetExpensesControllerParams) {
    this.interactor = params.interactor;
  }

  public async getExpenses(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputGetExpenses = {
      reference_month: request.query.reference_month as string,
      id_user: Number(request.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
