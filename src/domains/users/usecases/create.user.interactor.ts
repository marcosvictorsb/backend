import { ICreateUserGateway } from '../interfaces/';
import { InputCreateUser, CreateUserData } from '../interfaces/';
import { UserEntity } from '../entities/user.entity';
import { HttpResponse, IPresenter } from '../../../protocols';

export class CreateUserInteractor {
  constructor(private readonly gateway: ICreateUserGateway, private presenter: IPresenter ) {}

  async execute(input: InputCreateUser): Promise<HttpResponse> {
    this.gateway.loggerInfo('Creating user', { user: JSON.stringify(input) });

    try {
      const { email, name, password } = input;
      const existingUser = await this.gateway.findUserByEmail(email);
      if (existingUser) {
        this.gateway.loggerInfo('Usuario já existe para esse email', email);
        return this.presenter.conflict('Usuário já existe para esse email');
      }

      const createUserData: CreateUserData = {
        email, name, password: this.gateway.encryptPassword(password)
      }
      const userCreated = await this.gateway.createUser(createUserData);
      if(!userCreated) {
        this.gateway.loggerInfo('Usuário não encontrado', email);
        return this.presenter.notFound('Usuário não encontrado');
      }
      this.gateway.loggerInfo('Usuário criado com sucesso', JSON.stringify({ email: userCreated.email, name: userCreated.name }));
      
      return this.presenter.created(userCreated);
    } catch (error) {
      this.gateway.loggerError('Erro ao criar usuário', error );
      return this.presenter.serverError('Erro ao criar usuário');
    }
    
  }
}