import { IEncryptionService, ILoggerMixin } from "../../../adapters/services"
import { UserEntity } from "../../users/entities/user.entity"
import { FindUserCriteria } from "../../users/interfaces"
import { IUserRepository } from "../../users/interfaces"
import { ITokenService } from "../../../adapters/services"
import { HttpResponse } from "../../../protocols/http"
import logger from "../../../config/logger"

export type IAuthenticationGatewayDependencies = {
  repositories: {
    user: IUserRepository
  },
  logger: typeof logger
}

export interface GetTokenUseCases  {
  execute(email: string, password: string): Promise<HttpResponse>
}

export type GetTokenDependencies = {
  interactor: GetTokenUseCases 
}


export interface IGetTokenGateway {
  findUser(criteria: FindUserCriteria): Promise<UserEntity | null>
  sign(user: UserEntity): string;
  comparePasswords(password: string, userPassword: string): boolean;
  loggerInfo(message: string, data?: unknown): void;
  loggerError(message: string, data?: unknown): void;
}
