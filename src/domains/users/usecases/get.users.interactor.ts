import { IGetUsersGateway } from '../interfaces/';
import { IPresenter } from '../../../protocols/presenter';
import { HttpResponse } from '../../../protocols/http';
import { GetUsersInput } from '../interfaces/';
import { UserEntity } from '../entities/user.entity';

export class GetUsersInteractor {
  constructor(
    private readonly gateway: IGetUsersGateway,
    private presenter: IPresenter
  ) {}

  async execute(input: GetUsersInput): Promise<HttpResponse> {
    this.gateway.loggerInfo('Iniciando a busca de usuários', {
      data: JSON.stringify(input)
    });

    try {
      const { id_company, limit } = input;
      const users = await this.gateway.getUsers({ id_company, limit });
      if (!users?.length) {
        this.gateway.loggerInfo('Nenhum usuário encontrado', {
          data: JSON.stringify(input)
        });
        return this.presenter.notFound('Nenhum usuário encontrado');
      }
      this.gateway.loggerInfo('Usuários encontrados com sucesso', {
        data: users.map((user: UserEntity) => user.id)
      });
      return this.presenter.OK({
        users: users.map((user: UserEntity) => ({
          id: user.id,
          name: user.name,
          email: user.email
        }))
      });
    } catch (error) {
      this.gateway.loggerInfo('Erro buscar usuários', error);
      return this.presenter.serverError();
    }
  }
}
