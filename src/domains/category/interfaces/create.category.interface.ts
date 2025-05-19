import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryInteractor } from '../usecases/create.category.interactor';
import { CreateCategoryCriteria, FindCategoryCriteria } from './category';
import { ICategoryRepository } from './category';

export type InputCreateCategory = {
  name: string;
  color: number;
  id_user: number;
};

export type CreateCategoryControllerParams = {
  interactor: CreateCategoryInteractor;
};

export type CreateCategoryGatewayParams = {
  repository: ICategoryRepository;
  logger: typeof logger;
};

export interface ICreateCategoryGateway {
  createCategory(criteria: CreateCategoryCriteria): Promise<CategoryEntity>;
  findCategory(
    criteria: FindCategoryCriteria
  ): Promise<CategoryEntity | undefined>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
