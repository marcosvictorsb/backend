
import logger from '../../../config/logger';
import { UserRepository } from '../repositories/user.repository';
import { GetUsersGateway } from '../gateways';
import { GetUsersInteractor } from '../usecases';
import { UserModel } from '../model/user.model';
import { GetUsersGatewayParams } from '../interfaces/';
import { GetUsersController } from '../controllers';
import { Presenter } from '../../../protocols/presenter';


const userRepository = new UserRepository({ model: UserModel });

const gateway: GetUsersGatewayParams = {
  repository: userRepository,
  logger
}

const userGateway = new GetUsersGateway(gateway);
const presenter = new Presenter();
const interactor = new GetUsersInteractor(userGateway, presenter);
export const getUsersController = new GetUsersController({ interactor });
