import { FindBankCriteria, IGetBanksGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputGetBanks } from '../interfaces/';

export class GetBanksInteractor {
  constructor(
    private readonly gateway: IGetBanksGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetBanks): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Requisição iniciada para buscar de bancos', {});
      const { id_user } = input;
      const criteria: FindBankCriteria = { id_user };
      const banks = await this.gateway.getBanks(criteria);
      return this.presenter.OK(banks);
    } catch (error) {
      this.gateway.loggerError('Erro ao buscar os bancos', { error });
      return this.presenter.serverError('Erro ao buscar os bancos');
    }
  }
}
