import { LoggerMixin } from "../../adapters/services";

class BaseGateway { constructor(...args: any[]) {} }
export const MixDeleteExpenseService = LoggerMixin(BaseGateway);
