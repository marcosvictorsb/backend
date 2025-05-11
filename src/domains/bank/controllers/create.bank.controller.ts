import { Request, Response } from 'express';
import { CreateBankInteractor } from '../usecases/';
import { CreateBankControllerParams, InputCreateBank } from '../interfaces/';

interface ICreateBankController {
  createBank(request: Request, response: Response): Promise<Response>;
}

export class CreateBankController implements ICreateBankController {
  protected interactor: CreateBankInteractor;

  constructor(params: CreateBankControllerParams) {
    this.interactor = params.interactor;
  }

  public async createBank(request: Request, response: Response): Promise<Response> {
    const {name, amount} = request.body
    const input: InputCreateBank = {
      name,
      amount,
      id_user: Number(request.user?.id),
    }
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
