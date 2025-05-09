import { LoggerMixin, EncryptionService } from "../../services";

class BaseGateway { constructor(...args: any[]) {} }
export const MixCreateUserService = LoggerMixin(EncryptionService(BaseGateway));