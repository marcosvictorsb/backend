import { LoggerMixin } from "../../adapters/services";

class BaseGateway { constructor(...args: any[]) {} }
export const MixUpdateExpenseService = LoggerMixin(BaseGateway);
