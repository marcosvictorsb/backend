import { IGetCategoriesGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { InputGetCategories } from '../interfaces/';

export class GetCategoriesInteractor {
  constructor(
    private readonly gateway: IGetCategoriesGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: InputGetCategories): Promise<HttpResponse> {
    try {
      const { id_user } = input;
      this.gateway.loggerInfo(
        'Iniciado a requisição para buscar as cateroria',
        { data: JSON.stringify(input) }
      );

      const categories = await this.gateway.getCategories({ id_user });
      if (!categories) {
        this.gateway.loggerInfo('Categorias não encontrada');
        return this.presenter.notFound([]);
      }

      return this.presenter.OK(categories);
    } catch (error) {
      this.gateway.loggerError('Error ao buscar categorias', { error });
      return this.presenter.serverError('Error ao buscar categorias');
    }
  }
}
