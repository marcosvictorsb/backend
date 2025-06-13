import { ExpenseStatus, IDeleteExpenseGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputDeleteExpense } from '../interfaces/';
import { UpdateBankData } from '../../../domains/bank/interfaces';

export class DeleteExpenseInteractor {
  constructor(
    private readonly gateway: IDeleteExpenseGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputDeleteExpense): Promise<HttpResponse> {
    try {
      const { id_user, id } = input;
      const expense = await this.gateway.findExpense({ id_user, id });
      if (!expense) {
        this.gateway.loggerInfo('Despesa não encontrada', {
          id_user,
          id_expense: id
        });
        return this.presenter.notFound('Despesa não encontrada');
      }
      await this.gateway.deleteExpense({ id_user, id });
      
      const isExpense =
        expense.status.toLowerCase() === ExpenseStatus.PAID.toLowerCase();
      const bank = await this.gateway.findBank({ id: expense.id_bank });
      if (!bank) {
        this.gateway.loggerInfo('Banco não encontrado');
        return this.presenter.notFound('Banco não encontrado');
      }
      const newAmount = bank.amount + Number(expense.amount);
      const criteriaUpdate: UpdateBankData = {
        amount: newAmount,
        id: bank.id
      };
      await this.gateway.updateBank(criteriaUpdate);

      this.gateway.loggerInfo('Despesa deletada');
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
