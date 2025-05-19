import { Request, Response } from 'express';
import { CreateCategoryInteractor } from '../usecases/create.category.interactor';
import {
  CreateCategoryControllerParams,
  InputCreateCategory
} from '../interfaces/create.category.interface';

interface ICreateCategoryController {
  createCategory(request: Request, response: Response): Promise<Response>;
}

export class CreateCategoryController implements ICreateCategoryController {
  protected interactor: CreateCategoryInteractor;

  constructor(params: CreateCategoryControllerParams) {
    this.interactor = params.interactor;
  }

  public async createCategory(
    request: Request,
    response: Response
  ): Promise<Response> {
    const input: InputCreateCategory = {
      name: request.body.name,
      color: request.body.color,
      id_user: Number(request?.user?.id)
    };
    const result = await this.interactor.execute(input);
    return response.status(result.status).json(result.body);
  }
}
