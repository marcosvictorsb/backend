import { CalculateTotalExpensesData, FindExpensesCriteria, ICalculateTotalExpensesGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputCalculateTotalExpenses } from '../interfaces/';

export class CalculateTotalExpensesInteractor {
  constructor(private readonly gateway: ICalculateTotalExpensesGateway, private presenter: IPresenter) {}

  async execute(input: InputCalculateTotalExpenses): Promise<HttpResponse> {    
    try {
      this.gateway.loggerInfo('Iniciou a requisição para buscar a soma do total de despesa', {
        input: JSON.stringify(input)
      });
      const { id_user } = input


      const dates = this.getStartAndEndOfYearUTCFormatted()
      const criteria: FindExpensesCriteria = {
        id_user,
        createdStart: dates.startOfYear,
        createdEnd: dates.endOfYear
      }
      const expenses = await this.gateway.findExpenses(criteria)
      if(!expenses) {
        this.gateway.loggerInfo('Não tem valor cadatrado, então será necessário retornar o valor 0')
        return this.presenter.OK({ total: 0 })
      }

      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

      return this.presenter.OK({ total_expense: total});
    } catch (error) {
      this.gateway.loggerError('Erro ao realizar o calculo das despesas', { error });
      return this.presenter.serverError('Erro ao realizar o calculo das despesas');
    }
  }

  private getStartAndEndOfYearUTCFormatted(targetYear?: number): { startOfYear: Date; endOfYear: Date } {
    const year = targetYear || new Date().getFullYear();
    return {
      startOfYear: new Date(`${year}-01-01`),
      endOfYear: new Date(`${year}-12-31`),
    };
  }
}
