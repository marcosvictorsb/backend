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
    const userId = Number(request.user?.id);
    const inputs: InputCreateExpenses[] = request.body.map((expense: any) => ({
      id_user: userId,
      description: expense.description,
      amount: expense.amount,
      is_recurring: expense.is_recurring ?? false,
      recurring_count: expense.recurring_count ?? 0,
      status: expense.status || 'pending',
      id_bank: expense.id_bank,
      date_payment: expense.date_payment
    }));

    const result = await this.interactor.execute(inputs);
    return response.status(result.status).json(result.body);
  }
}
