import bcrypt from 'bcryptjs';
import logger from '../../../config/logger';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserGateway } from '../gateways/create.user.gateway';
import { CreateUserInteractor } from '../usecases/create.user.interactor';
import { UserModel } from '../model/user.model';
import { CreateUserGatewayParams } from '../interfaces/';
import { CreateUserController } from '../controllers/create.user.controller';
import { Presenter } from '../../../protocols/presenter';


const userRepository = new UserRepository({ model: UserModel });

const gateway: CreateUserGatewayParams = {
  repository: userRepository,
  bcrypt,
  logger
}

const userGateway = new CreateUserGateway(gateway);
const presenter = new Presenter();
const createUserInteractor = new CreateUserInteractor(userGateway, presenter);
export const createUserController = new CreateUserController({ useCases: {createUser: createUserInteractor}});
