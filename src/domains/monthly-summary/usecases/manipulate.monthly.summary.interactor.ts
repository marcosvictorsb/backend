import { IManipulateMonthlySummaryGateway, InputManipulateMonthlySummary } from '../interfaces/manipulate.monthly.summary.interface';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { MonthlySummaryEntity } from '../entities/monthly.summary.entity';

export class ManipulateMonthlySummaryInteractor {
  constructor(
    private gateway: IManipulateMonthlySummaryGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputManipulateMonthlySummary): Promise<HttpResponse> {
    try {
      this.gateway.loggerInfo('Iniciando manipulação de resumo mensal', {
        input: JSON.stringify(input)
      });

      const { userId, referenceMonth, amount, type, operation } = input;

      // Validar formato do mês de referência
      if (!MonthlySummaryEntity.validateReferenceMonth(referenceMonth)) {
        this.gateway.loggerError('Formato de reference_month inválido', { referenceMonth } as any);
        return this.presenter.badRequest('Formato de reference_month deve ser MM/YYYY');
      }

      // Validar amount
      if (amount <= 0) {
        this.gateway.loggerError('Valor deve ser maior que zero', { amount } as any);
        return this.presenter.badRequest('Valor deve ser maior que zero');
      }

      // Validar type
      if (!['income', 'expense'].includes(type)) {
        this.gateway.loggerError('Tipo inválido', { type } as any);
        return this.presenter.badRequest('Tipo deve ser "income" ou "expense"');
      }

      // Manipular o resumo mensal
      const updatedSummary = await this.gateway.manipulateMonthlySummary({
        userId,
        referenceMonth,
        amount,
        type,
        operation
      });

      this.gateway.loggerInfo('Resumo mensal manipulado com sucesso', {
        id: updatedSummary.id,
        referenceMonth,
        userId,
        type,
        operation,
        amount
      } as any);

      return this.presenter.OK(updatedSummary.toJSON());

    } catch (error) {
      this.gateway.loggerError('Erro ao manipular resumo mensal', { error });
      return this.presenter.serverError('Erro interno do servidor');
    }
  }
}
