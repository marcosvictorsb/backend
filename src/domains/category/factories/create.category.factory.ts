import logger from '../../../config/logger';
import { CategoryRepository } from '../repositories/category';
import { CreateCategoryInteractor } from '../usecases';
import CategoryModel from '../model/category.model';
import { CreateCategoryGatewayParams } from '../interfaces';
import { CreateCategoryController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import { CreateCategoryGateway } from '../gateways';

const categoryRepository = new CategoryRepository({ model: CategoryModel });

const gateway: CreateCategoryGatewayParams = {
  repository: categoryRepository,
  logger
};

const CategoryGateway = new CreateCategoryGateway(gateway);
const presenter = new Presenter();
const interactor = new CreateCategoryInteractor(CategoryGateway, presenter);
export const createCategoryController = new CreateCategoryController({ interactor });
