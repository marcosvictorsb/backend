import { Request, Response } from 'express';
import { GetIncomesInteractor } from '../usecases/get.incomes.interactor';
import { GetIncomesControllerParams, InputGetIncomes } from '../interfaces';

interface IGetIncomesController {
  getIncomes(request: Request, response: Response): Promise<Response>;
}

export class GetIncomesController implements IGetIncomesController {
  protected interactor: GetIncomesInteractor;

  constructor(params: GetIncomesControllerParams) {
    this.interactor = params.interactor;
  }

  public async getIncomes(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputGetIncomes = {
      reference_month: request.query.reference_month as string,
      id_user: Number(request.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
