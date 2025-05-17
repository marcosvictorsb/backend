import { FindIncomesCriteria, IGetIncomesGateway } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputGetIncomes } from '../interfaces';

export class GetIncomesInteractor {
  constructor(
    private readonly gateway: IGetIncomesGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetIncomes): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando busca de receita', {
        requestTxt: JSON.stringify(input)
      });
      const { reference_month, id_user } = input;
      const criteria: FindIncomesCriteria = { reference_month, id_user };
      const incomes = await this.gateway.getIncomes(criteria);
      return this.presenter.OK(incomes);
    } catch (error) {
      this.gateway.loggerError('Erro ao buscar receita', { error });
      return this.presenter.serverError('Erro ao buscar receita');
    }
  }
}
