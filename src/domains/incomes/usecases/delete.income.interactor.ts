import { IDeleteIncomeGateway } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputDeleteIncome } from '../interfaces';

export class DeleteIncomeInteractor {
  constructor(private readonly gateway: IDeleteIncomeGateway, private presenter: IPresenter) {}

  async execute(input: InputDeleteIncome): Promise<HttpResponse> {   
    try {
      const { id_user, id } = input;
      const IncomeExists = await this.gateway.findIncome({ id_user, id });
      if (!IncomeExists) {
        this.gateway.loggerInfo('Despesa não encontrada', { id_user, id_income: id });
        return this.presenter.notFound('Despesa não encontrada');
      }
      await this.gateway.deleteIncome({ id_user, id });
      this.gateway.loggerInfo('Despesa deletada');
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
