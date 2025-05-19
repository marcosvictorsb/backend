import { IGetBalanceGateway, InputGetBalance } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';

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
      return this.presenter.OK();
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
