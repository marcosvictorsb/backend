import { ModelStatic } from 'sequelize';
import { CategoryEntity } from '../entities/category.entity';
import CategoryModel from '../model/category.model';

export type CreateCategoryCriteria = {
  name: string;
  color: number;
  id_user: number;
};

export type FindCategoryCriteria = {
  id?: number;
  name?: string;
  color?: number;
  id_user?: number;
};

export type DeleteCategoryCriteria = {
  id?: number;
  name?: string;
  color?: number;
  id_user?: number;
};

export type UpdateCategoryCriteria = {
  id?: number;
  name?: string;
  color?: number;
  id_user?: number;
};

export type ICategoryRepositoryDependencies = {
  model: ModelStatic<CategoryModel>;
};

export interface ICategoryRepository {
  create(criteria: CreateCategoryCriteria): Promise<CategoryEntity>;
  find(criteria: FindCategoryCriteria): Promise<CategoryEntity | undefined>;
  findAll(criteria: FindCategoryCriteria): Promise<CategoryEntity[]>;
  delete(criteria: DeleteCategoryCriteria): Promise<boolean>;
  update(criteria: UpdateCategoryCriteria): Promise<boolean>;
}
