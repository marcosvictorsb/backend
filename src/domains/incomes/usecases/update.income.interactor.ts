import {
  IncomeStatus,
  IUpdateIncomeGateway,
  UpdateIncomeData
} from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputUpdateIncome } from '../interfaces';

export class UpdateIncomeInteractor {
  constructor(
    private readonly gateway: IUpdateIncomeGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputUpdateIncome): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Atualizando receita', {
        requestTxt: JSON.stringify(input)
      });
      const { id, amount, description, id_user, status, id_bank } = input;

      const currentIncome = await this.gateway.findIncome({ id });
      if (!currentIncome) {
        this.gateway.loggerInfo('Receita não encontrada', {
          requestTxt: JSON.stringify(input)
        });
        return this.presenter.notFound('Receita não encontrada');
      }

      const isChangingBank = id_bank && currentIncome.id_bank !== id_bank;
      const oldBank = await this.gateway.findBank({
        id: currentIncome.id_bank
      });
      if (isChangingBank && !oldBank) {
        this.gateway.loggerInfo('Banco antigo não encontrado', {
          id_bank: currentIncome.id_bank
        });
        return this.presenter.notFound('Banco antigo não encontrado');
      }

      if (status === IncomeStatus.RECEIVED) {
        const newBank = await this.gateway.findBank({ id: id_bank });

        if (!newBank) {
          this.gateway.loggerInfo('Novo banco não encontrado', {
            id_bank: id_bank
          });
          return this.presenter.notFound('Banco não encontrado');
        }

        if (isChangingBank) {
          const oldBankNewAmount = oldBank!.amount - currentIncome.amount;
          await this.gateway.updateBank({
            id: oldBank!.id,
            amount: oldBankNewAmount
          });

          const newBankNewAmount = newBank.amount + amount;
          await this.gateway.updateBank({
            id: newBank.id,
            amount: newBankNewAmount
          });
        } else {
          const amountDifference = amount - currentIncome.amount;
          const newBankAmount = newBank.amount + amountDifference;
          await this.gateway.updateBank({
            id: newBank.id,
            amount: newBankAmount
          });
        }
      } else if (
        currentIncome.status === IncomeStatus.RECEIVED &&
        status !== IncomeStatus.RECEIVED
      ) {
        const bank = await this.gateway.findBank({ id: currentIncome.id_bank });
        if (bank) {
          const newBankAmount = bank.amount - currentIncome.amount;
          await this.gateway.updateBank({ id: bank.id, amount: newBankAmount });
        }
      }

      const updateCriteria: UpdateIncomeData = {
        id,
        amount,
        description,
        id_user,
        status,
        id_bank,
      };
      await this.gateway.updateIncome(updateCriteria);
      this.gateway.loggerInfo('Income atualizado');

      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerError('Erro ao atualizar receita', { error });
      return this.presenter.serverError('Erro ao atualizar receita');
    }
  }
}
