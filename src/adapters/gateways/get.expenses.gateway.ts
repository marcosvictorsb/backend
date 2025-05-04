import { LoggerMixin } from "../services/logger.service";

class BaseGateway { constructor(...args: any[]) {} }
export const MixGetExpensesService = LoggerMixin(BaseGateway);
