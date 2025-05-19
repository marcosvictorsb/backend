import { ICreateCategoryGateway, InputCreateCategory } from '../interfaces';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';

export class CreateCategoryInteractor {
  constructor(private readonly gateway: ICreateCategoryGateway, private presenter: IPresenter) {}

  async execute(input: InputCreateCategory): Promise<HttpResponse> {   
    try {
      this.gateway.loggerInfo('Iniciou a requisição para criar despesa', { data: JSON.stringify(input)  });
      const { name, id_user, color } = input;
      const category = await this.gateway.findCategory({
        name, id_user
      })

      if(category) {
        this.gateway.loggerInfo('Categoria já cadastrada')
        return this.presenter.conflict('Categoria já cadastrada')
      }

      const categoryCreated = await this.gateway.createCategory({ name, id_user, color })
      this.gateway.loggerInfo('Categoria criada', { data: JSON.stringify(categoryCreated) })
      
      return this.presenter.created(categoryCreated);
    } catch (error) {
      this.gateway.loggerError('Erro ao criar despesa', { error });
      return this.presenter.serverError('Erro ao criar despesa');
    }
  }
}
