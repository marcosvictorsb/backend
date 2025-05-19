import { Request, Response } from 'express';
import { GetBalanceInteractor } from '../usecases/get.balance.interactor';
import { GetBalanceControllerParams } from '../interfaces/get.balance.interface';

interface IGetBalanceController {
  getBalance(request: Request, response: Response): Promise<Response>;
}

export class GetBalanceController implements IGetBalanceController {
  protected interactor: GetBalanceInteractor;

  constructor(params: GetBalanceControllerParams) {
    this.interactor = params.interactor;
  }

  public async getBalance(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input = {
      id_user: Number(request?.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
