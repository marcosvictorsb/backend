import {
  CreateExpensesCriteria,
  DeleteExpenseData,
  FindExpensesCriteria,
  IExpenseRepository,
  IExpenseRepositoryDependencies,
  UpdateExpenseData
} from '../interfaces';
import { ModelStatic, Op } from 'sequelize';
import ExpenseModel from '../model/expense.model';
import { ExpenseEntity } from '../entity/expenses.entity';

export class ExpenseRepository implements IExpenseRepository {
  protected model: ModelStatic<ExpenseModel>;

  constructor(params: IExpenseRepositoryDependencies) {
    this.model = params.model;
  }

  private getConditions(criteria: FindExpensesCriteria): Record<string, any> {
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
    if (criteria.createdStart || criteria.createdEnd) {
      whereConditions['created_at'] = {
        ...(criteria.createdStart && { [Op.gte]: criteria.createdStart }),
        ...(criteria.createdEnd && { [Op.lte]: criteria.createdEnd })
      };
    }

    return whereConditions;
  }

  public async create(data: CreateExpensesCriteria): Promise<ExpenseEntity> {
    const expense = await this.model.create(data);
    return new ExpenseEntity({
      id: expense.id,
      amount: expense.amount,
      description: expense.description,
      reference_month: expense.reference_month,
      id_user: expense.id_user,
      status: expense.status,
      created_at: expense.created_at,
      updated_at: expense.updated_at,
      deleted_at: expense.deleted_at
    });
  }

  public async find(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity | null> {
    const expense = await this.model.findOne({
      where: this.getConditions(criteria),
      raw: true
    });

    if (!expense) return null;

    return new ExpenseEntity(expense);
  }

  public async findAll(
    criteria: FindExpensesCriteria
  ): Promise<ExpenseEntity[]> {
    const expenses = await this.model.findAll({
      where: this.getConditions(criteria)
    });

    if (!expenses.length) return [];

    return expenses.map(
      (expense: ExpenseEntity) =>
        new ExpenseEntity({
          id: expense.id,
          amount: expense.amount,
          description: expense.description,
          reference_month: expense.reference_month,
          status: expense.status,
          id_user: expense.id_user
        })
    );
  }

  public async update(criteria: UpdateExpenseData): Promise<boolean> {
    const [affectedRows] = await this.model.update(criteria, {
      where: { id: criteria.id }
    });
    if (affectedRows === 0) return false;

    return affectedRows > 0;
  }

  public async delete(criteria: DeleteExpenseData): Promise<boolean> {
    const options = {
      where: this.getConditions(criteria),
      force: false
    };
    const affectedRows = await this.model.destroy(options);
    if (affectedRows === 0) return false;
    return affectedRows > 0;
  }
}
