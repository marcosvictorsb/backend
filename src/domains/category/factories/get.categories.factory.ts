import logger from '../../../config/logger';
import { CategoryRepository } from '../repositories/category';
import { GetCategoriesInteractor } from '../usecases';
import CategoryModel from '../model/category.model';
import {GetCategoriesGatewayParams } from '../interfaces';
import {GetCategoriesController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';
import {GetCategoriesGateway } from '../gateways';

const categoryiesRepository = new CategoryRepository({ model: CategoryModel });

const gateway:GetCategoriesGatewayParams = {
  repository: categoryiesRepository,
  logger
};

const CategoryGateway = new GetCategoriesGateway(gateway);
const presenter = new Presenter();
const interactor = new GetCategoriesInteractor(CategoryGateway, presenter);
export const getCategoriesController = new GetCategoriesController({ interactor });
