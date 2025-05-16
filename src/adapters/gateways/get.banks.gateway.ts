import { LoggerMixin } from "../../../src/adapters/services";

class BaseGateway { constructor(...args: any[]) {} }
export const MixGetBanksService = LoggerMixin(BaseGateway);
