import { Request, Response } from 'express';
import { DeleteIncomeInteractor } from '../usecases/delete.income.interactor';
import { DeleteIncomeControllerParams, InputDeleteIncome } from '../interfaces/delete.income.interface';

interface IDeleteIncomeController {
  deleteIncome(request: Request, response: Response): Promise<Response>;
}

export class DeleteIncomeController implements IDeleteIncomeController {
  protected interactor: DeleteIncomeInteractor;

  constructor(params: DeleteIncomeControllerParams) {
    this.interactor = params.interactor;
  }

  public async deleteIncome(request: Request, response: Response): Promise<Response> {
    const input: InputDeleteIncome = {
      id_user: Number(request.user?.id),
      id: Number(request.params.id),
    }  
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
