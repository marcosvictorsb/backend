import { GetTokenMixed } from "../../../adapters/gateways";
import { UserEntity } from "../../users/entities/user.entity"
import { FindUserCriteria, IUserRepository } from "../../users/interfaces"
import { IAuthenticationGatewayDependencies, IGetTokenGateway } from "../interfaces";



export class GetTokenGateway extends GetTokenMixed implements IGetTokenGateway {
  user: IUserRepository

  constructor(params: IAuthenticationGatewayDependencies) {
    super(params)
    this.user = params.repositories.user
  }

  async findUser(criteria: FindUserCriteria): Promise<UserEntity | null> {
    return await this.user.find(criteria) ?? null;
  }
}