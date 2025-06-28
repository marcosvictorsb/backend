import {
  IncomeOutput,
  FindIncomesCriteria,
  ICreateIncomesGateway,
  IncomeStatus
} from '../interfaces';
import { IPresenter, HttpResponse } from '../../../protocols';
import { InputCreateIncomes } from '../interfaces';
import {
  FindBankCriteria,
  UpdateBankData
} from '../../../domains/bank/interfaces';
import { ManipulateMonthlySummaryInteractor } from '../../../domains/monthly-summary/usecases/';
import { ManipulateMonthlySummaryType } from '../../../domains/monthly-summary/interfaces';
import { OperationType } from '../../../domains/monthly-summary/interfaces';

export class CreateIncomesInteractor {
  constructor(
    private readonly gateway: ICreateIncomesGateway,
    private presenter: IPresenter,
    private manipulateMonthlySummaryInteractor: ManipulateMonthlySummaryInteractor
  ) {}

  async execute(input: InputCreateIncomes): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Criando registros de receita', {
        requestTxt: JSON.stringify(input)
      });
      const { is_recurring, id_bank, amount, status } = input;

      const incomes = is_recurring
        ? await this.createRecurringIncomes(input)
        : await this.createSingleIncome(input);

      if (!incomes.length) {
        this.gateway.loggerInfo('Registro de receita não criado', {
          requestTxt: JSON.stringify(input)
        });
        return this.presenter.conflict(
          'Registros de receita já cadastrado anteriormente'
        );
      }

      this.gateway.loggerInfo('Registros de receitas criados com sucesso', {
        requestTxt: JSON.stringify(incomes)
      });

      const bankCriteria: FindBankCriteria = {
        id: id_bank
      };

      if (status === IncomeStatus.RECEIVED) {
        const bank = await this.gateway.findBank(bankCriteria);
        if (!bank) {
          this.gateway.loggerInfo('Banco não encontrado', {
            requestTxt: JSON.stringify(bank)
          });
          return this.presenter.notFound('Banco não encontrado');
        }
        const updatedAmount = bank.amount + Number(amount);
        const criteriaUpdate: UpdateBankData = {
          amount: updatedAmount,
          id: bank.id
        };
        await this.gateway.updateBank(criteriaUpdate);
      }

      return this.presenter.created({
        ...incomes[0]
      });
    } catch (error) {
      this.gateway.loggerError('Erro ao criar receitas', { error });
      return this.presenter.serverError('Erro ao criar receitas');
    }
  }

  private async createRecurringIncomes(
    input: InputCreateIncomes
  ): Promise<IncomeOutput[]> {
    const { amount, description, id_user, recurring_count, status, id_bank } =
      input;
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
        id_bank
      };
      const IncomeExists = await this.gateway.findIncomes(criteria);
      if (IncomeExists) {
        this.gateway.loggerInfo('Registro de receita já existe', {
          requestTxt: JSON.stringify(IncomeExists)
        });
        continue;
      }

      const data = {
        amount,
        description,
        id_user,
        id_bank,
        is_recurring: true,
        reference_month: this.formatMonthYear(month),
        status: index === firstIncome ? status : 'aguardando pagamento'
      };

      const Income = await this.gateway.createIncomes(data);
      Incomes.push({
        amount: Income.amount,
        description: Income.description,
        reference_month: Income.reference_month,
        status: Income.status,
        id_bank: Income.id_bank
      });
    }

    return Incomes;
  }

  private async createSingleIncome(
    input: InputCreateIncomes
  ): Promise<IncomeOutput[]> {
    const { amount, description, id_user, status, id_bank } = input;

    const criteria: FindIncomesCriteria = {
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      amount,
      description
    };
    const IncomeExists = await this.gateway.findIncomes(criteria);
    if (IncomeExists) {
      this.gateway.loggerInfo('Registro de receita já existe', {
        requestTxt: JSON.stringify(IncomeExists)
      });
      return [];
    }

    const data = {
      amount,
      description,
      id_user,
      reference_month: this.formatMonthYear(new Date()),
      status,
      id_bank
    };

    const income = await this.gateway.createIncomes(data);
    this.gateway.loggerInfo('Registro de receita criado com sucesso', {
      requestTxt: JSON.stringify(income)
    });
    this.gateway.loggerInfo('Criando resumo mensal', {
      requestTxt: JSON.stringify({
        reference_month: income.reference_month,
        id_user: income.id_user
      })
    });

    await this.manipulateMonthlySummaryInteractor.execute({
      referenceMonth: income.reference_month,
      userId: income.id_user,
      amount: income.amount,
      type: ManipulateMonthlySummaryType.Income,
      operation: OperationType.Add
    });

    return [
      {
        amount: income.amount,
        description: income.description,
        reference_month: income.reference_month,
        status: income.status
      }
    ];
  }

  private formatMonthYear(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  }
}
