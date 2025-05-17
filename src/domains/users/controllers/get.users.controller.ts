import { Request, Response } from 'express';
import { GetUsersInteractor } from '../usecases/get.users.interactor';
import { GetUsersControllerDependencies, GetUsersInput } from '../interfaces/';

interface IGetUsersController {
  getUsers(request: Request, response: Response): Promise<Response>;
}

export class GetUsersController implements IGetUsersController {
  protected interactor: GetUsersInteractor;

  constructor(params: GetUsersControllerDependencies) {
    this.interactor = params.interactor;
  }

  public async getUsers(
    request: Request,
    response: Response
  ): Promise<Response> {
    const { id_company, limit } = request.query;

    const input: GetUsersInput = {
      id_company: Number(id_company),
      limit: limit ? Number(limit) : 25
    };
    const { status, body } = await this.interactor.execute(input);
    console.log(body);
    return response.status(status).json(body);
  }
}
