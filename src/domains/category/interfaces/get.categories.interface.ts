import { DataLogOutput } from '../../../adapters/services';
import logger from '../../../config/logger';
import { CategoryEntity } from '../entities/category.entity';
import { FindCategoryCriteria, ICategoryRepository } from '../interfaces';
import { GetCategoriesInteractor } from '../usecases';

export type InputGetCategories = {
  id_user: number;
};

export type GetCategoriesData = {
  // Defina os campos de dados aqui
};

export type GetCategoriesControllerParams = {
  interactor: GetCategoriesInteractor;
};

export type GetCategoriesGatewayParams = {
  repository: ICategoryRepository;
  logger: typeof logger;
};

export interface IGetCategoriesGateway {
  getCategories(criteria: FindCategoryCriteria): Promise<CategoryEntity[]>;
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerError(message: string, data?: DataLogOutput): void;
}
