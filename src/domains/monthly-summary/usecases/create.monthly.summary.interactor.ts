import { ICreateMonthlySummaryGateway, InputCreateMonthlySummary } from '../interfaces/create.monthly.summary.interface';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';

export class CreateMonthlySummaryInteractor {
  constructor(
    private gateway: ICreateMonthlySummaryGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputCreateMonthlySummary): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando criação de resumo mensal', {
        input: JSON.stringify(input)
      });

      const { reference_month, id_user, amount } = input;

      // Validar formato do mês de referência
      if (!MonthlySummaryEntity.validateReferenceMonth(reference_month)) {
        this.gateway.loggerError('Formato de reference_month inválido', { reference_month } as any);
        return this.presenter.badRequest('Formato de reference_month deve ser MM/YYYY');
      }

      // Verificar se já existe um resumo para o usuário e mês
      const existingSummary = await this.gateway.findByUserAndMonth(id_user, reference_month);
      if (existingSummary) {
        this.gateway.loggerError('Resumo mensal já existe', {
          id_user,
          reference_month
        } as any);
        const updatedTotalIncomes = existingSummary.total_incomes + amount;

        await this.gateway.updateMonthlySummary(
          { total_incomes: updatedTotalIncomes },
          { id: existingSummary.id }
        );
        this.gateway.loggerInfo(
          'Resumo mensal atualizado com novo total de receitas',
          {
            id: existingSummary.id,
            total_incomes: existingSummary.total_incomes,
            reference_month,
            id_user
          } as any
        );

        return this.presenter.OK();
      }

      // Criar o resumo mensal
      const monthlySummaryData = {
        reference_month,
        total_incomes: amount,
        balance: -amount,
        id_user
      };

      const createdSummary = await this.gateway.create(monthlySummaryData);

      this.gateway.loggerInfo('Resumo mensal criado com sucesso', {
        id: createdSummary.id,
        reference_month,
        id_user
      } as any);

      return this.presenter.created(createdSummary.toJSON());

    } catch (error) {
      this.gateway.loggerError('Erro ao criar resumo mensal', { error });
      return this.presenter.serverError('Erro interno do servidor');
    }
  }
}
