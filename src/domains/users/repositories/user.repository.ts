import { UserModel } from '../model/user.model';
import { UserEntity } from '../entities/user.entity';
import { ModelStatic, Op } from 'sequelize';
import { DeleteCriteria, FindUserCriteria, IUserRepository, UpdateCriteria, UserRepositoryParams } from '../interfaces/user.interface';
import { CreateUserData } from '../interfaces';

export class UserRepository implements IUserRepository  {
  protected model: ModelStatic<UserModel> ;

  constructor(params: UserRepositoryParams) {
    this.model = params.model;
  }  

  private getConditions(criteria: FindUserCriteria): Record<string, any> {    
    const whereConditions: Record<string, any> = {};

    if (criteria.name) {
      whereConditions['name'] = criteria.name;
    }

    if (criteria.email) {
      whereConditions['email'] = criteria.email;
    }

    if (criteria.password) {
      whereConditions['password'] = criteria.password;
    }

    return whereConditions;
  }

  public async create(data: CreateUserData): Promise<UserEntity> {
    const createdUser = await this.model.create(data);
    return new UserEntity(createdUser);
  }

  public async find(criteria: FindUserCriteria): Promise<UserEntity | null> {
    const user = await this.model.findOne({
      where: this.getConditions(criteria),
      raw: true,
    });

    if (!user) return null;
    return new UserEntity(user);
  }

  public async findAll(criteria: FindUserCriteria): Promise<UserEntity[] | null> {
    const users = await this.model.findAll({
      where: this.getConditions(criteria),
      limit: criteria.limit,
      attributes: {
        exclude: ['password'],
      },     
      
      raw: true,
    });

    // if (!users || users.length === 0) return undefined;

    return users.map(
      (user: any) =>
        new UserEntity(user),
    );
  }

  public async update(criteria: UpdateCriteria, data: Partial<UserEntity>): Promise<UserEntity | null> {
    const [affectedRows] = await this.model.update(data, { where: { id: criteria.id } });
    if (affectedRows === 0) return null;

    const updatedUser = await this.model.findByPk(criteria.id);
    if (!updatedUser) return null;

    return new UserEntity(updatedUser);
  }

  public async delete(criteria: DeleteCriteria): Promise<boolean> {
    const affectedRows = await this.model.destroy({ where: { id: criteria.id } });
    return affectedRows > 0;
  }
}


