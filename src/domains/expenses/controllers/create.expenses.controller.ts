import { Request, Response } from 'express';
import { CreateExpensesInteractor } from '../usecases/create.expenses.interactor';
import {
  CreateExpensesControllerParams,
  InputCreateExpenses
} from '../interfaces/';

interface ICreateExpensesController {
  createExpenses(request: Request, response: Response): Promise<Response>;
}

export class CreateExpensesController implements ICreateExpensesController {
  protected interactor: CreateExpensesInteractor;

  constructor(params: CreateExpensesControllerParams) {
    this.interactor = params.interactor;
  }

  public async createExpenses(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputCreateExpenses = {
      id_user: Number(request.user?.id),
      description: request.body.description,
      amount: request.body.amount * 100,
      is_recurring: request.body.is_recurring ?? false,
      recurring_count: request.body.recurring_count,
      status: request.body.status,
      id_bank: request.body.id_bank,
      date_payment: request.body?.date_payment      
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
