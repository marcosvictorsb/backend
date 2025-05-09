import { IncomeOutput, FindIncomesCriteria, ICreateIncomesGateway } from '../interfaces';
import { IPresenter, HttpResponse } from '../../../protocols';
import { InputCreateIncomes } from '../interfaces';

export class CreateIncomesInteractor {
  constructor(private readonly gateway: ICreateIncomesGateway, private presenter: IPresenter) {}

  async execute(input: InputCreateIncomes): Promise<HttpResponse> {   
    try {
      this.gateway.loggerInfo('Criando registros de receita', { requestTxt: JSON.stringify(input)} );
      const { is_recurring } = input;

      const incomes = is_recurring
        ? await this.createRecurringIncomes(input)
        : await this.createSingleIncome(input);

      if (!incomes.length) {
        this.gateway.loggerInfo('Registro de receita não criado', { requestTxt: JSON.stringify(input)});
        return this.presenter.conflict('Registros de receita já cadastrado anteriormente');
      }

      this.gateway.loggerInfo('Registros de receitas criados com sucesso', { requestTxt: JSON.stringify(incomes)});
      return this.presenter.created({
        ...incomes[0],
      });
    } catch (error) {
      console.log(error);
      this.gateway.loggerError('Erro ao criar receitas', { error });
      return this.presenter.serverError('Erro ao criar receitas');
    }
  }

  private async createRecurringIncomes(input: InputCreateIncomes): Promise<IncomeOutput[]> {
    const { amount, description, id_user, recurring_count, status } = input;
    const reference_month = new Date();
    const Incomes = [];
    const firstIncome = 0;

    for (let index = 0; index < (recurring_count ?? 0); index++) {
      const month = new Date(reference_month);
      month.setMonth(reference_month.getMonth() + index);       

      const criteria: FindIncomesCriteria = {
        id_user,
        reference_month: this.formatMonthYear(month),
        amount,
        description,
      };
      const IncomeExists = await this.gateway.findIncomes(criteria);
      if (IncomeExists) {
        this.gateway.loggerInfo('Registro de receita já existe', { requestTxt: JSON.stringify(IncomeExists)});
        continue;
      }

      const data = {
        amount,
        description,
        id_user,
        is_recurring: true,
        reference_month: this.formatMonthYear(month),
        status: index === firstIncome ? status : 'aguardando pagamento',
      };

      const Income = await this.gateway.createIncomes(data);
      Incomes.push({
        amount: Income.amount,
			  description: Income.description,
			  reference_month: Income.reference_month,
        status: Income.status,
      });
    }

    return Incomes;
  }

  private async createSingleIncome(input: InputCreateIncomes): Promise<IncomeOutput[]> {
    const { amount, description, id_user, status } = input;

    const criteria: FindIncomesCriteria = {
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      amount,
      description,
    };
    const IncomeExists = await this.gateway.findIncomes(criteria);
    if (IncomeExists) {
      this.gateway.loggerInfo('Registro de receita já existe', { requestTxt: JSON.stringify(IncomeExists)});
      return [];
    }

    const data = {
      amount,
      description,
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      status
    };

    const Income = await this.gateway.createIncomes(data);
    return [{
      amount: Income.amount,
      description: Income.description,
      reference_month: Income.reference_month,
      status: Income.status,
    }];
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
