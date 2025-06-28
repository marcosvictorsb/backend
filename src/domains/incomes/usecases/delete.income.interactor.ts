import { IDeleteIncomeGateway, IncomeStatus } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputDeleteIncome } from '../interfaces';
import { UpdateBankData } from '../../../domains/bank/interfaces';
import { ManipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/usecases';
import {
  ManipulateMonthlySummaryType,
  OperationType
} from '../../../domains/monthly-summary/interfaces';

export class DeleteIncomeInteractor {
  constructor(
    private readonly gateway: IDeleteIncomeGateway,
    private presenter: IPresenter,
    private manipulateMonthlySummaryInteractor: ManipulateMonthlySummaryInteractor
  ) {}

  async execute(input: InputDeleteIncome): Promise<HttpResponse> {
    try {
      const { id_user, id } = input;

      const income = await this.gateway.findIncome({ id_user, id });
      if (!income) {
        this.gateway.loggerInfo('Despesa não encontrada', {
          id_user,
          id_income: id
        });
        return this.presenter.notFound('Despesa não encontrada');
      }
      await this.gateway.deleteIncome({ id_user, id });

      if (income.status === IncomeStatus.RECEIVED) {
        const bank = await this.gateway.findBank({ id: income.id_bank });
        if (!bank) {
          this.gateway.loggerInfo('Banco não encontrado');
          return this.presenter.notFound('Banco não encontrado');
        }
        const newAmount = bank.amount - Number(income.amount);
        const criteriaUpdate: UpdateBankData = {
          amount: newAmount,
          id: bank.id
        };
        await this.gateway.updateBank(criteriaUpdate);

        await this.manipulateMonthlySummaryInteractor.execute({
          referenceMonth: income.reference_month,
          userId: income.id_user,
          amount: income.amount,
          type: ManipulateMonthlySummaryType.Income,
          operation: OperationType.Subtract
        });
      }

      this.gateway.loggerInfo('Despesa deletada');
      return this.presenter.OK();
    } catch (error) {
      this.gateway.loggerInfo('Despesa deletada', { error });
      return this.presenter.serverError('Despesa deletada');
    }
  }
}
