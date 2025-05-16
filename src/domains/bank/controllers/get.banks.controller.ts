import { Request, Response } from 'express';
import { GetBanksInteractor } from '../usecases/';
import { GetBanksControllerParams } from '../interfaces/';

interface IGetBanksController {
  getBanks(request: Request, response: Response): Promise<Response>;
}

export class GetBanksController implements IGetBanksController {
  protected interactor: GetBanksInteractor;

  constructor(params: GetBanksControllerParams) {
    this.interactor = params.interactor;
  }

  public async getBanks(request: Request, response: Response): Promise<Response> {
    const input = {
      id_user: Number(request.user?.id),
    }
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
