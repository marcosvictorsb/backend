import {
  CreateIncomesCriteria,
  DeleteIncomeData,
  FindIncomesCriteria,
  IIncomeRepository,
  IIncomeRepositoryDependencies,
  UpdateIncomeData
} from '../interfaces';
import { ModelStatic } from 'sequelize';
import IncomeModel from '../model/income.model';
import { IncomeEntity } from '../entity/income.entity';

export class IncomeRepository implements IIncomeRepository {
  protected model: ModelStatic<IncomeModel>;

  constructor(params: IIncomeRepositoryDependencies) {
    this.model = params.model;
  }

  private getConditions(criteria: FindIncomesCriteria): Record<string, any> {
    const whereConditions: Record<string, any> = {};

    if (criteria.id) {
      whereConditions['id'] = criteria.id;
    }
    if (criteria.description) {
      whereConditions['description'] = criteria.description;
    }
    if (criteria.amount) {
      whereConditions['amount'] = criteria.amount;
    }
    if (criteria.reference_month) {
      whereConditions['reference_month'] = criteria.reference_month;
    }
    if (criteria.id_user) {
      whereConditions['id_user'] = criteria.id_user;
    }
    if (criteria.created_at) {
      whereConditions['created_at'] = criteria.created_at;
    }
    if (criteria.updated_at) {
      whereConditions['updated_at'] = criteria.updated_at;
    }
    if (criteria.deleted_at) {
      whereConditions['deleted_at'] = criteria.deleted_at;
    }

    return whereConditions;
  }

  public async create(data: CreateIncomesCriteria): Promise<IncomeEntity> {
    const income = await this.model.create(data);
    return new IncomeEntity({
      id: income.id,
      amount: income.amount,
      description: income.description,
      reference_month: income.reference_month,
      id_user: income.id_user,
      id_bank: income.id_bank,
      status: income.status,
      created_at: income.created_at,
      updated_at: income.updated_at,
      deleted_at: income.deleted_at
    });
  }

  public async find(
    criteria: FindIncomesCriteria
  ): Promise<IncomeEntity | undefined> {
    const income = await this.model.findOne({
      where: this.getConditions(criteria),
      raw: true
    });

    if (!income) return undefined;

    return new IncomeEntity(income);
  }

  public async findAll(criteria: FindIncomesCriteria): Promise<IncomeEntity[]> {
    const income = await this.model.findAll({
      where: this.getConditions(criteria)
    });

    if (!income.length) return [];

    return income.map(
      (Income: IncomeEntity) =>
        new IncomeEntity({
          id: Income.id,
          amount: Income.amount,
          description: Income.description,
          reference_month: Income.reference_month,
          status: Income.status,
          id_user: Income.id_user,
          id_bank: Income.id_bank
        })
    );
  }

  public async update(criteria: UpdateIncomeData): Promise<boolean> {
    const [affectedRows] = await this.model.update(criteria, {
      where: { id: criteria.id }
    });
    if (affectedRows === 0) return false;

    return affectedRows > 0;
  }

  public async delete(criteria: DeleteIncomeData): Promise<boolean> {
    const options = {
      where: this.getConditions(criteria),
      force: false
    };
    const affectedRows = await this.model.destroy(options);
    if (affectedRows === 0) return false;
    return affectedRows > 0;
  }
}
