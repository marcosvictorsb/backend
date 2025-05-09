import { IUpdateIncomeGateway, UpdateIncomeData } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputUpdateIncome } from '../interfaces/';

export class UpdateIncomeInteractor {
  constructor(private readonly gateway: IUpdateIncomeGateway, private presenter: IPresenter) {}

  async execute(input: InputUpdateIncome): Promise<HttpResponse> {   

    try {
      this.gateway.loggerInfo('Atualizando receita', { requestTxt: JSON.stringify(input) });
      const updateCriteria: UpdateIncomeData = {
        id: input.id,
        amount: input?.amount,
        description: input.description,
        id_user: input.id_user,
        status: input.status
      }
      await this.gateway.updateIncome(updateCriteria)
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao atualizar receita', { error });
      return this.presenter.serverError('Erro ao atualizar receita');
    }
  }
}
