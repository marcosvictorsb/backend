import { FindIncomesCriteria, ICalculateTotalIncomesGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputCalculateTotalIncomes } from '../interfaces/';

export class CalculateTotalIncomesInteractor {
  constructor(private readonly gateway: ICalculateTotalIncomesGateway, private presenter: IPresenter) {}

  async execute(input: InputCalculateTotalIncomes): Promise<HttpResponse> {    

    try {
      const { id_user } = input
      
      const criteria: FindIncomesCriteria = {
        id_user,
        reference_month: this.formatMonthYear(new Date())
      }

      const incomes = await this.gateway.findIncomes(criteria)
      if(!incomes) {
        this.gateway.loggerInfo('Não tem valor cadatrado, então será necessário retornar o valor 0')
        return this.presenter.OK({ total: 0 })
      }

      const total = incomes.reduce((sum, income) => sum + income.amount, 0);

      return this.presenter.OK({ total_income: total});
    } catch (error) {
      this.gateway.loggerInfo('Erro ao realizar o calculo das receitas', error);
      return this.presenter.serverError('Erro ao realizar o calculo das receitas');
    }
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
