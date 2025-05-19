import { ICategoryRepository, IGetCategoriesGateway, GetCategoriesGatewayParams, GetCategoriesData, FindCategoryCriteria } from '../interfaces/';
import { CategoryEntity } from '../entities/category.entity';
import { MixGetCategoriesService } from '../../../adapters/gateways/categories/get.categories.gateway';

export class GetCategoriesGateway extends MixGetCategoriesService implements IGetCategoriesGateway {
  categoriesRepository: ICategoryRepository;

  constructor(params: GetCategoriesGatewayParams) {
    super(params);
    this.categoriesRepository = params.repository;
  }

  async getCategories(criteria: FindCategoryCriteria): Promise<CategoryEntity[]> {
    return this.categoriesRepository.findAll(criteria);
  }
}
