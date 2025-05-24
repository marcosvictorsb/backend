import { ModelStatic } from 'sequelize';
import CategoryModel from '../model/category.model';
import {
  CreateCategoryCriteria,
  DeleteCategoryCriteria,
  FindCategoryCriteria,
  ICategoryRepository,
  ICategoryRepositoryDependencies,
  UpdateCategoryCriteria
} from '../interfaces';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryRepository implements ICategoryRepository {
  protected model: ModelStatic<CategoryModel>;

  constructor(params: ICategoryRepositoryDependencies) {
    this.model = params.model;
  }

  private getConditions(criteria: FindCategoryCriteria): Record<string, any> {
    const whereConditions: Record<string, any> = {};

    if (criteria.id) {
      whereConditions['id'] = criteria.id;
    }
    if (criteria.name) {
      whereConditions['name'] = criteria.name;
    }
    if (criteria.id_user) {
      whereConditions['id_user'] = criteria.id_user;
    }

    if (criteria.icon) {
      whereConditions['icon'] = criteria.icon;
    }

    return whereConditions;
  }

  public async create(data: CreateCategoryCriteria): Promise<CategoryEntity> {
    const category = await this.model.create(data);
    return new CategoryEntity({
      id: category.id,
      icon: category.icon,
      name: category.name,
      id_user: category.id_user
    });
  }

  public async find(
    criteria: FindCategoryCriteria
  ): Promise<CategoryEntity | undefined> {
    const category = await this.model.findOne({
      where: this.getConditions(criteria),
      raw: true
    });

    if (!category) return undefined;

    return new CategoryEntity(category);
  }

  public async findAll(
    criteria: FindCategoryCriteria
  ): Promise<CategoryEntity[]> {
    const categories = await this.model.findAll({
      where: this.getConditions(criteria)
    });

    if (!categories.length) return [];

    return categories.map(
      (category: CategoryEntity) =>
        new CategoryEntity({
          id: category.id,
          icon: category.icon,
          name: category.name,
          id_user: category.id_user
        })
    );
  }

  public async update(criteria: UpdateCategoryCriteria): Promise<boolean> {
    const [affectedRows] = await this.model.update(criteria, {
      where: { id: criteria.id }
    });
    if (affectedRows === 0) return false;

    return affectedRows > 0;
  }

  public async delete(criteria: DeleteCategoryCriteria): Promise<boolean> {
    const options = {
      where: this.getConditions(criteria),
      force: false
    };
    const affectedRows = await this.model.destroy(options);
    if (affectedRows === 0) return false;
    return affectedRows > 0;
  }
}
