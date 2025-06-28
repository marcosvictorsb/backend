import { IGetMonthlySummaryGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputGetMonthlySummary } from '../interfaces/';
import { IncomeStatus } from '../../../domains/incomes/interfaces';
import { ExpenseStatus } from '../../../domains/expenses/interfaces';
import Utils from '../../../helpers/utils';

export class GetMonthlySummaryInteractor {
  constructor(
    private readonly gateway: IGetMonthlySummaryGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetMonthlySummary): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo(
        'Iniciado o processo para buscar o resumo mensal do ano atual'
      );
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

      const monthlySummary = Array.from({ length: 12 }, (_, i) => ({
        month: i,
        total_credit: 0,
        total_debit: 0
      }));

      for (const income of incomes) {
        if (!income.created_at) {
          continue;
        }
        const date = new Date(income.created_at);
        const month = date.getMonth();
        monthlySummary[month].total_credit += income.amount;
      }

      for (const expense of expenses) {
        if (!expense.date_payment) {
          continue;
        }
        const date = new Date(expense.date_payment);
        const month = date.getMonth();
        monthlySummary[month].total_debit += expense.amount;
      }

      return this.presenter.OK(monthlySummary);
    } catch (error) {
      this.gateway.loggerError('Error para buscar o resumo por mes', { error });
      return this.presenter.serverError('Error para buscar o resumo por mes');
    }
  }
}
