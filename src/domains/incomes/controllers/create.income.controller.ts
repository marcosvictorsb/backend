import { Request, Response } from 'express';
import { CreateIncomesInteractor } from '../usecases/create.incomes.interactor';
import { CreateIncomesControllerParams, InputCreateIncomes } from '../interfaces';

interface ICreateIncomesController {
  createIncomes(request: Request, response: Response): Promise<Response>;
}

export class CreateIncomesController implements ICreateIncomesController {
  protected interactor: CreateIncomesInteractor;

  constructor(params: CreateIncomesControllerParams) {
    this.interactor = params.interactor;
  }

  public async createIncomes(request: Request, response: Response): Promise<Response> {
    const input: InputCreateIncomes = {
      id_user: Number(request.user?.id),
      description: request.body.description,
      amount: request.body.amount * 100,
      is_recurring: request.body.is_recurring ?? false,
      recurring_count: request.body.recurring_count,
      status: request.body.status
    }
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
