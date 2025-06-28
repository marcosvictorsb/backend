import { IGetMonthlySummaryGateway, InputGetMonthlySummary } from '../interfaces/get.monthly.summary.interface';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';

export class GetMonthlySummaryInteractor {
  constructor(
    private gateway: IGetMonthlySummaryGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetMonthlySummary): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando busca de resumos mensais', {
        input: JSON.stringify(input)
      });

      const { id_user, reference_month } = input;

      if (reference_month) {
        // Buscar resumo específico por mês
        const summary = await this.gateway.findByUserAndMonth(id_user, reference_month);
        
        if (!summary) {
          this.gateway.loggerInfo('Resumo mensal não encontrado', { id_user, reference_month } as any);
          return this.presenter.notFound('Resumo mensal não encontrado');
        }

        this.gateway.loggerInfo('Resumo mensal encontrado', { id: summary.id } as any);
        return this.presenter.OK(summary.toJSON());
      } else {
        // Buscar todos os resumos do usuário
        const summaries = await this.gateway.findAll({ id_user });
        
        this.gateway.loggerInfo('Resumos mensais encontrados', { count: summaries.length } as any);
        
        const summariesData = summaries.map(summary => summary.toJSON());
        return this.presenter.OK(summariesData);
      }

    } catch (error) {
      this.gateway.loggerError('Erro ao buscar resumos mensais', { error });
      return this.presenter.serverError('Erro interno do servidor');
    }
  }
}
