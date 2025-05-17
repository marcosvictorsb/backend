import { ModelStatic } from 'sequelize';
import BankModel from '../model/bank.model';
import {
  CreateBankCriteria,
  DeleteBankData,
  FindBankCriteria,
  IBankRepository,
  IBankRepositoryDependencies,
  UpdateBankData
} from '../interfaces';
import { BankEntity } from '../entities/bank.entity';

export class BankRepository implements IBankRepository {
  protected model: ModelStatic<BankModel>;

  constructor(params: IBankRepositoryDependencies) {
    this.model = params.model;
  }

  private getConditions(criteria: FindBankCriteria): Record<string, any> {
    const whereConditions: Record<string, any> = {};

    if (criteria.id) {
      whereConditions['id'] = criteria.id;
    }
    if (criteria.name) {
      whereConditions['name'] = criteria.name;
    }
    if (criteria.amount) {
      whereConditions['amount'] = criteria.amount;
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

  public async create(data: CreateBankCriteria): Promise<BankEntity> {
    const bank = await this.model.create(data);
    return new BankEntity({
      id: bank.id,
      amount: bank.amount,
      name: bank.name,
      id_user: bank.id_user,
      created_at: bank.created_at,
      updated_at: bank.updated_at,
      deleted_at: bank.deleted_at
    });
  }

  public async find(
    criteria: FindBankCriteria
  ): Promise<BankEntity | undefined> {
    const bank = await this.model.findOne({
      where: this.getConditions(criteria),
      raw: true
    });

    if (!bank) return undefined;

    return new BankEntity(bank);
  }

  public async findAll(criteria: FindBankCriteria): Promise<BankEntity[]> {
    const Banks = await this.model.findAll({
      where: this.getConditions(criteria)
    });

    if (!Banks.length) return [];

    return Banks.map(
      (Bank: BankEntity) =>
        new BankEntity({
          id: Bank.id,
          amount: Bank.amount,
          name: Bank.name,
          id_user: Bank.id_user
        })
    );
  }

  public async update(criteria: UpdateBankData): Promise<boolean> {
    const [affectedRows] = await this.model.update(criteria, {
      where: { id: criteria.id }
    });
    if (affectedRows === 0) return false;

    return affectedRows > 0;
  }

  public async delete(criteria: DeleteBankData): Promise<boolean> {
    const options = {
      where: this.getConditions(criteria),
      force: false
    };
    const affectedRows = await this.model.destroy(options);
    if (affectedRows === 0) return false;
    return affectedRows > 0;
  }
}
