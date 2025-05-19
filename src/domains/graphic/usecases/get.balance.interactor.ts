import { IGetBalanceGateway, InputGetBalance } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import Utils from '../../../helpers/utils';
import { ExpenseStatus } from '../../../domains/expenses/interfaces';
import { IncomeStatus } from '../../../domains/incomes/interfaces';

export class GetBalanceInteractor {
  constructor(
    private readonly gateway: IGetBalanceGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetBalance): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando o request pegar o balanço anual', {
        data: JSON.stringify(input)
      });
      const { id_user } = input;
      const expenses = await this.gateway.findExpenses({
        id_user,
        status: ExpenseStatus.PAID,
        datePaymentStart: Utils.getFirstDayOfYear(),
        datePaymentEnd: Utils.getLastDayOfYear()
      });
      this.gateway.loggerInfo('Foi realizad a busca das expenses');

      const incomes = await this.gateway.findIncomes({
        id_user,
        status: IncomeStatus.RECEIVED,
        dateCreateStart: Utils.getFirstDayOfYear(),
        dateCreateEnd: Utils.getLastDayOfYear()
      });
      this.gateway.loggerInfo('Foi realizad a busca das incomes');

      const hasNoExpenses = expenses && !expenses.length;
      const hasNoIncomes = incomes && !incomes.length;
      if (hasNoExpenses && hasNoIncomes) {
        this.gateway.loggerInfo('Não temos receita e nem despesa');
        return this.presenter.notFound('Não temos receita e nem despesa');
      }

      const totalExpenses = expenses.reduce(
        (accumulator, expense) => accumulator + expense.amount,
        0
      );
      const totalIncomes = incomes.reduce(
        (acccumulator, income) => acccumulator + income.amount,
        0
      );
      const totalBalance = totalIncomes - totalExpenses;
      const percetual =
        totalExpenses === 0
          ? 0
          : ((totalIncomes - totalExpenses) * 100) / totalExpenses;

      return this.presenter.OK({
        totalBalance,
        percetual: percetual.toFixed(2)
      });
    } catch (error) {
      this.gateway.loggerInfo('Erro realizar os calculo de balanço anual', {
        error
      });
      return this.presenter.serverError(
        'Erro realizar os calculo de balanço anual'
      );
    }
  }
}
