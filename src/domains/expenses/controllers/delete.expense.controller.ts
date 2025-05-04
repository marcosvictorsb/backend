import { Request, Response } from 'express';
import { DeleteExpenseInteractor } from '../usecases/delete.expense.interactor';
import { DeleteExpenseControllerParams, InputDeleteExpense } from '../interfaces/delete.expense.interface';

interface IDeleteExpenseController {
  deleteExpense(request: Request, response: Response): Promise<Response>;
}

export class DeleteExpenseController implements IDeleteExpenseController {
  protected interactor: DeleteExpenseInteractor;

  constructor(params: DeleteExpenseControllerParams) {
    this.interactor = params.interactor;
  }

  public async deleteExpense(request: Request, response: Response): Promise<Response> {
    const input: InputDeleteExpense = {
      id_user: Number(request.user?.id),
      id: Number(request.params.id),
    }  
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
