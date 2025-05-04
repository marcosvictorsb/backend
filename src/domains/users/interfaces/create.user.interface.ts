import logger from '../../../config/logger';
import { UserEntity  } from '../entities/user.entity';
import { IUserRepository } from './user.interface';

export type InputCreateUser = {
  name: string;
  email: string;
  password: string;
}

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
}

export type CreateUserGatewayParams = {
  repository: IUserRepository;  
  logger: typeof logger,
  bcrypt: typeof import('bcryptjs');
}

export interface ICreateUserGateway {
  createUser(data: CreateUserData): Promise<UserEntity>;
  findUserByEmail(email: string): Promise<UserEntity | null>;
  encryptPassword(password: string): string;
  loggerInfo(message: string, data?: unknown): void;
  loggerError(message: string, data?: unknown): void;
}
