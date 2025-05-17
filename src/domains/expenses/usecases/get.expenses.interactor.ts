import { FindExpensesCriteria, IGetExpensesGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputGetExpenses } from '../interfaces/';

export class GetExpensesInteractor {
  constructor(
    private readonly gateway: IGetExpensesGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetExpenses): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando busca de despesas', {
        requestTxt: JSON.stringify(input)
      });
      const { reference_month, id_user } = input;
      const criteria: FindExpensesCriteria = { reference_month, id_user };
      const expenses = await this.gateway.getExpenses(criteria);
      return this.presenter.OK(expenses);
    } catch (error) {
      this.gateway.loggerError('Erro ao buscar expenses', { error });
      return this.presenter.serverError('Erro ao buscar expenses');
    }
  }
}
