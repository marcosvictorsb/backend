import {
  IGetMonthlySummaryGateway,
  InputGetMonthlySummary,
  MonthlySummaryResult,
  MonthlySummaryListResult
} from '../interfaces/get.monthly.summary.interface';

export class GetMonthlySummaryInteractor {
  constructor(private gateway: IGetMonthlySummaryGateway) {}

  async execute(
    input: InputGetMonthlySummary
  ): Promise<MonthlySummaryResult | MonthlySummaryListResult> {
    this.gateway.loggerInfo('Iniciando busca de resumos mensais', {
      input: JSON.stringify(input)
    });

    const { id_user, reference_month } = input;

    if (reference_month) {
      // Buscar resumo específico por mês
      const summary = await this.gateway.findByUserAndMonth(
        id_user,
        reference_month
      );

      if (!summary) {
        this.gateway.loggerInfo('Resumo mensal não encontrado', {
          id_user,
          reference_month
        } as any);
        throw new Error('Resumo mensal não encontrado');
      }

      // Buscar saldo do mês anterior
      const initialBalance = await this.gateway.findPreviousMonthBalance(
        id_user,
        reference_month
      );

      this.gateway.loggerInfo('Resumo mensal encontrado', {
        id: summary.id
      } as any);

      return {
        reference_month: summary.reference_month,
        total_incomes: summary.total_incomes,
        total_expenses: summary.total_expenses,
        balance: summary.balance,
        initial_balance: initialBalance
      };
    } else {
      // Buscar todos os resumos do usuário
      const summaries = await this.gateway.findAll({ id_user });

      this.gateway.loggerInfo('Resumos mensais encontrados', {
        count: summaries.length
      } as any);

      const summariesData: MonthlySummaryResult[] = [];

      for (const summary of summaries) {
        const initialBalance = await this.gateway.findPreviousMonthBalance(
          id_user,
          summary.reference_month
        );

        summariesData.push({
          reference_month: summary.reference_month,
          total_incomes: summary.total_incomes,
          total_expenses: summary.total_expenses,
          balance: summary.balance,
          initial_balance: initialBalance
        });
      }

      return { summaries: summariesData };
    }
  }
}
