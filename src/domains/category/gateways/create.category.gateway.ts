import {
  ICategoryRepository,
  ICreateCategoryGateway,
  CreateCategoryGatewayParams,
  CreateCategoryCriteria
} from '../interfaces/';
import { CategoryEntity } from '../entities/category.entity';
import { MixCreateCategoryService } from '../../../adapters/gateways/categories/create.category.gateway';

export class CreateCategoryGateway
  extends MixCreateCategoryService
  implements ICreateCategoryGateway
{
  categoryRepository: ICategoryRepository;

  constructor(params: CreateCategoryGatewayParams) {
    super(params);
    this.categoryRepository = params.repository;
  }

  async createCategory(
    criteria: CreateCategoryCriteria
  ): Promise<CategoryEntity> {
    return await this.categoryRepository.create(criteria);
  }

  async findCategory(
    criteria: CreateCategoryCriteria
  ): Promise<CategoryEntity | undefined> {
    return await this.categoryRepository.find(criteria);
  }
}
