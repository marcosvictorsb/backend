import { IUserRepository, IGetUsersGateway, GetUsersGatewayParams, FindUserCriteria } from '../interfaces/';
import { UserEntity } from '../entities/user.entity';
import { MixGetUsersService } from '../../../adapters/gateways';

export class GetUsersGateway extends MixGetUsersService implements IGetUsersGateway {
  userRepository: IUserRepository;

  constructor(params: GetUsersGatewayParams) {
    super(params);
    this.userRepository = params.repository;
  }

  async getUsers(data: FindUserCriteria): Promise<UserEntity[] | null> {
    return this.userRepository.findAll(data);
  }
}
