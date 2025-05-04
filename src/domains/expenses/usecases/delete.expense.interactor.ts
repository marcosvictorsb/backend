import { IDeleteExpenseGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputDeleteExpense } from '../interfaces/';

export class DeleteExpenseInteractor {
  constructor(private readonly gateway: IDeleteExpenseGateway, private presenter: IPresenter) {}

  async execute(input: InputDeleteExpense): Promise<HttpResponse> {   
    try {
      const { id_user, id } = input;
      const expenseExists = await this.gateway.findExpense({ id_user, id });
      if (!expenseExists) {
        this.gateway.loggerInfo('Despesa não encontrada', { id_user, id_expense: id });
        return this.presenter.notFound('Despesa não encontrada');
      }
      await this.gateway.deleteExpense({ id_user, id });
      this.gateway.loggerInfo('Despesa deletada');
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
