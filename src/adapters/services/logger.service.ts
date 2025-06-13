import logger from '../../config/logger';

type LoggerServiceDependencies = {
  logger: typeof logger;
};

export type DataLogOutput = {
  data?: any;
  teamsIds?: number[];
  error?: any;
  input?: any;
  requestTxt?: string;

  id_user?: number;
  id_expense?: number;
  id_income?: number;

  id_bank?: number;
  count?: number;
  existingCount?: number;
  createdCount?: number;
  existing?: number;

  expense?: string;
};

export interface ILoggerMixin {
  loggerInfo(message: string, data?: DataLogOutput): void;
  loggerErro(message: string, data?: DataLogOutput): void;
}

export function LoggerMixin<T extends new (...args: any[]) => {}>(Base: T) {
  return class extends Base {
    private logger: typeof logger;

    constructor(...args: any[]) {
      super(...args);
      const params = args[0] as LoggerServiceDependencies;
      this.logger = params.logger;
    }

    loggerInfo(message: string, data?: unknown) {
      return this.logger.info(message, data);
    }

    loggerError(message: string, data?: unknown) {
      return this.logger.error(message, data);
    }
  };
}
