import { LoggerMixin } from '../../services';

class BaseGateway {
  constructor(...args: any[]) {}
}
export const MixGetBanksService = LoggerMixin(BaseGateway);
