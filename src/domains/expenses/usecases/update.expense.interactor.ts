import { IUpdateExpenseGateway, UpdateExpenseData } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputUpdateExpense } from '../interfaces/';

export class UpdateExpenseInteractor {
  constructor(
    private readonly gateway: IUpdateExpenseGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputUpdateExpense): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Atualizando despesa', {
        requestTxt: JSON.stringify(input)
      });
      const updateCriteria: UpdateExpenseData = {
        id: input.id,
        amount: input?.amount,
        description: input.description,
        id_user: input.id_user,
        status: input.status
      };
      await this.gateway.updateExpense(updateCriteria);
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
