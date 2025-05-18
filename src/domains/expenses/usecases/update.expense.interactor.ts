import { ExpenseStatus, IUpdateExpenseGateway, UpdateExpenseData } from '../interfaces/';
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
      const { id, amount, description, id_user, status, id_bank, date_payment } = input;
      
      const currentExpense = await this.gateway.findExpense({ id });
      if (!currentExpense) {
        this.gateway.loggerInfo('Receita não encontrada', {
          requestTxt: JSON.stringify(input)
        });
        return this.presenter.notFound('Receita não encontrada');
      }
      
      const isChangingBank = id_bank && currentExpense.id_bank !== id_bank;
      const oldBank = await this.gateway.findBank({
        id: currentExpense.id_bank
      });
      if (isChangingBank && !oldBank) {
        this.gateway.loggerInfo('Banco antigo não encontrado', {
          id_bank: currentExpense.id_bank
        });
        return this.presenter.notFound('Banco antigo não encontrado');
      }

      if (status === ExpenseStatus.PAID) {
        const newBank = await this.gateway.findBank({ id: id_bank });

        if (!newBank) {
          this.gateway.loggerInfo('Novo banco não encontrado', {
            id_bank: id_bank
          });
          return this.presenter.notFound('Banco não encontrado');
        }

        if (isChangingBank) {
          const oldBankNewAmount = oldBank!.amount + currentExpense.amount;
          await this.gateway.updateBank({
            id: oldBank!.id,
            amount: oldBankNewAmount
          });

          const newBankNewAmount = newBank.amount - amount;
          await this.gateway.updateBank({
            id: newBank.id,
            amount: newBankNewAmount
          });
        } else {
          const amountDifference = amount - currentExpense.amount;
          const newBankAmount = newBank.amount - amountDifference;
          await this.gateway.updateBank({
            id: newBank.id,
            amount: newBankAmount
          });
        }
      } else if (
        currentExpense.status === ExpenseStatus.PAID &&
        status !== ExpenseStatus.PAID
      ) {
        const bank = await this.gateway.findBank({ id: currentExpense.id_bank });
        if (bank) {
          const newBankAmount = bank.amount - currentExpense.amount;
          await this.gateway.updateBank({ id: bank.id, amount: newBankAmount });
        }
      }

      const updateCriteria: UpdateExpenseData = {
        id,
        amount,
        description,
        id_user,
        status,
        id_bank,
        date_payment
      };
      await this.gateway.updateExpense(updateCriteria);
      this.gateway.loggerInfo('Expense atualizado');

      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Erro ao criar usuário', { error });
      return this.presenter.serverError('Erro ao criar usuário');
    }
  }
}
