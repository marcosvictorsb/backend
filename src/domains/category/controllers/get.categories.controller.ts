import { Request, Response } from 'express';
import { GetCategoriesInteractor } from '../usecases/get.categories.interactor';
import {
  GetCategoriesControllerParams,
  InputGetCategories
} from '../interfaces/get.categories.interface';

interface IGetCategoriesController {
  getCategories(request: Request, response: Response): Promise<Response>;
}

export class GetCategoriesController implements IGetCategoriesController {
  protected interactor: GetCategoriesInteractor;

  constructor(params: GetCategoriesControllerParams) {
    this.interactor = params.interactor;
  }

  public async getCategories(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputGetCategories = {
      id_user: Number(request.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
