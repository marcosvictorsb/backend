import { Request, Response } from 'express';
import { UpdateExpenseInteractor } from '../usecases/update.expense.interactor';
import { UpdateExpenseControllerParams } from '../interfaces';

interface IUpdateExpenseController {
  updateExpense(request: Request, response: Response): Promise<Response>;
}

export class UpdateExpenseController implements IUpdateExpenseController {
  protected interactor: UpdateExpenseInteractor;

  constructor(params: UpdateExpenseControllerParams) {
    this.interactor = params.interactor;
  }

  public async updateExpense(
    request: Request,
    response: Response
  ): Promise<Response> {
    const result = await this.interactor.execute(request.body);
    return response.status(result.status).json(result.body);
  }
}
