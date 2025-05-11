import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { FindBankCriteria, InputCreateBank, ICreateBankGateway } from '../interfaces';

export class CreateBankInteractor {
  constructor(private readonly gateway: ICreateBankGateway, private presenter: IPresenter) {}

  async execute(input: InputCreateBank): Promise<HttpResponse> {  

    try {
      const { id_user, name, amount } = input
      this.gateway.loggerInfo('Iniciando o processo para criar um banco');
      const criteriaFindBank: FindBankCriteria = { id_user, name }
      const bank = await this.gateway.findBank(criteriaFindBank)
      if(bank) {
        this.gateway.loggerInfo('Banco já registrado')
        this.presenter.conflict('Banco já registrado')
      }
      const bankCreated = await this.gateway.createBank({
        id_user,
        name, 
        amount: Number(amount)
      })
      return this.presenter.created(bankCreated);
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar banco', error);
      return this.presenter.serverError('Erro ao criar banco');
    }
  }
}
