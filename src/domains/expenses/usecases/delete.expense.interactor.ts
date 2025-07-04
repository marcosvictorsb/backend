import { ExpenseStatus, IDeleteExpenseGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputDeleteExpense } from '../interfaces/';
import { UpdateBankData } from '../../../domains/bank/interfaces';
import { ManipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/usecases';
import {
  ManipulateMonthlySummaryType,
  OperationType
} from '../../../domains/monthly-summary/interfaces';

export class DeleteExpenseInteractor {
  constructor(
    private readonly gateway: IDeleteExpenseGateway,
    private presenter: IPresenter,
    private manipulateMonthlySummaryInteractor: ManipulateMonthlySummaryInteractor
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
      const isPending =
        expense.status.toLowerCase() === ExpenseStatus.PENDING.toLowerCase();
      if (expense.status === ExpenseStatus.PENDING) {
        this.gateway.loggerInfo(
          'A despensa está depedente, não precisa atualizar o banco'
        );
        return this.presenter.OK();
      }
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

      // Remover do monthly summary quando a despesa estava paga
      if (expense.status.toLowerCase() === ExpenseStatus.PAID.toLowerCase()) {
        await this.manipulateMonthlySummaryInteractor.execute({
          referenceMonth: expense.reference_month,
          userId: expense.id_user,
          amount: expense.amount,
          type: ManipulateMonthlySummaryType.Expense,
          operation: OperationType.Subtract
        });
      }

      this.gateway.loggerInfo('Despesa deletada');
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
