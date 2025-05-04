import { ModelStatic } from 'sequelize';
import { UserEntity as User } from '../entities/user.entity';
import { UserModel } from '../model/user.model';
import { CreateUserInteractor } from '../usecases/create.user.interactor';
import { CreateUserData } from './create.user.interface';

export type FindUserCriteria = {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  id_company?: number;
  limit?: number;
}

export type UpdateCriteria = {
  id: number
}

export type DeleteCriteria = {
  id: number
}

export type UserRepositoryParams = {
  model: ModelStatic<UserModel>; 
}

export type IToken = { 
  sign(user: User, secret: string, options: unknown): string;
}



export interface UserControllerParams {
  useCases: {
    createUser: CreateUserInteractor
  };
}

export interface IUserGateway {
  createUser(data: CreateUserData): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}

export interface IUserRepository {
  create(user: { email: string; password: string }): Promise<User>;
  find(criteria: FindUserCriteria): Promise<User | null>;
  findAll(criteria: FindUserCriteria): Promise<User[] | null>;
  update(criteria: UpdateCriteria, data: Partial<User>): Promise<User | null>;
  delete(criteria: DeleteCriteria): Promise<boolean>;
}

