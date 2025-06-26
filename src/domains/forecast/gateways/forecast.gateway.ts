import { IForecastGateway, IForecastRepository, ForecastGatewayParams } from '../interfaces';
import { IncomeEntity } from '../../incomes/entity/income.entity';
import { ExpenseEntity } from '../../expenses/entity/expenses.entity';
import { BankEntity } from '../../bank/entities/bank.entity';
import { LoggerMixin } from '../../../adapters/services';

class BaseGateway {
  constructor(...args: any[]) {}
}

const MixForecastService = LoggerMixin(BaseGateway);

export class ForecastGateway extends MixForecastService implements IForecastGateway {
  private repository: IForecastRepository;

  constructor(params: ForecastGatewayParams) {
    super(params);
    this.repository = params.repository;
  }

  async findIncomesByUserAndMonth(userId: number, referenceMonth: string): Promise<IncomeEntity[]> {
    return this.repository.findIncomesByUserAndMonth(userId, referenceMonth);
  }

  async findExpensesByUserAndMonth(userId: number, referenceMonth: string): Promise<ExpenseEntity[]> {
    return this.repository.findExpensesByUserAndMonth(userId, referenceMonth);
  }

  async findBanksByUser(userId: number): Promise<BankEntity[]> {
    return this.repository.findBanksByUser(userId);
  }
}
