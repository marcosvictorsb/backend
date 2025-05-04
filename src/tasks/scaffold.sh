#!/bin/bash

# Função para exibir mensagens estilizadas
function display_message {
    figlet -f slant "$1" | lolcat
}

# Função para listar domínios existentes
function list_domains {
    local domains_dir="src/domains"
    if [ -d "$domains_dir" ]; then
        echo "Domínios disponíveis:"
        ls "$domains_dir"
    else
        echo "Nenhum domínio encontrado."
        exit 1
    fi
}

# Função para selecionar um domínio existente
function select_domain {
    local domains_dir="src/domains"
    local domains=($(ls "$domains_dir"))
    local domain_name

    while true; do
        read -p "Digite o nome do domínio: " domain_name
        if [[ -d "$domains_dir/$domain_name" ]]; then
            echo "$domain_name"
            break
        else
            echo "Domínio não encontrado. Tente novamente."
            list_domains
        fi
    done
}

# Função para formatar nomes (remove pontos e converte para PascalCase ou camelCase)
function format_name {
    local name=$1
    local format_type=$2
    # Remove pontos e divide em partes
    IFS='.' read -ra parts <<< "$name"
    local formatted_name=""
    for part in "${parts[@]}"; do
        if [[ "$format_type" == "pascal" ]]; then
            formatted_name+="${part^}"
        elif [[ "$format_type" == "camel" ]]; then
            if [[ -z "$formatted_name" ]]; then
                formatted_name+="${part,,}"
            else
                formatted_name+="${part^}"
            fi
        fi
    done
    echo "$formatted_name"
}

# Função para extrair o nome da entidade (remove o prefixo do caso de uso)
function get_entity_name {
    local use_case_name=$1
    # Remove o prefixo (ex: "delete." ou "create.")
    local entity_name="${use_case_name#*.}"
    # Converte para PascalCase
    echo "$(format_name "$entity_name" "pascal")"
}

# Função para criar o conteúdo do arquivo controller
function create_controller_content {
    local use_case_name=$1
    local formatted_name=$(format_name "$use_case_name" "pascal")
    local camel_case_name=$(format_name "$use_case_name" "camel")

    echo "import { Request, Response } from 'express';"
    echo "import { ${formatted_name}Interactor } from '../usecases/${use_case_name}.interactor';"
    echo "import { ${formatted_name}ControllerParams } from '../interfaces/${use_case_name}.interface';"
    echo ""
    echo "interface I${formatted_name}Controller {"
    echo "  ${camel_case_name}(request: Request, response: Response): Promise<Response>;"
    echo "}"
    echo ""
    echo "export class ${formatted_name}Controller implements I${formatted_name}Controller {"
    echo "  protected interactor: ${formatted_name}Interactor;"
    echo ""
    echo "  constructor(params: ${formatted_name}ControllerParams) {"
    echo "    this.interactor = params.interactor;"
    echo "  }"
    echo ""
    echo "  public async ${camel_case_name}(request: Request, response: Response): Promise<Response> {"
    echo "    const result = await this.interactor.execute(request.body);"
    echo "    return response.status(result.status).json(result.body);"
    echo "  }"
    echo "}"
}

# Função para criar o conteúdo do arquivo interactor
function create_interactor_content {
    local use_case_name=$1
    local formatted_name=$(format_name "$use_case_name" "pascal")

    echo "import { I${formatted_name}Gateway } from '../interfaces/';"
    echo "import { IPresenter } from '../../../protocols/presenter';"
    echo "import { HttpResponse } from '../../../protocols/http';"
    echo "import { Input${formatted_name} } from '../interfaces/';"
    echo ""
    echo "export class ${formatted_name}Interactor {"
    echo "  constructor(private readonly gateway: I${formatted_name}Gateway, private presenter: IPresenter) {}"
    echo ""
    echo "  async execute(input: Input${formatted_name}): Promise<HttpResponse> {"
    echo "    this.gateway.loggerInfo();"
    echo ""
    echo "    try {"
    echo "      return this.presenter.created();"
    echo "    } catch (error) {"
    echo "      this.gateway.loggerInfo('Erro ao criar usuário', error);"
    echo "      return this.presenter.serverError('Erro ao criar usuário');"
    echo "    }"
    echo "  }"
    echo "}"
}

# Função para criar o conteúdo do arquivo gateway
function create_gateway_content {
    local use_case_name=$1
    local formatted_name=$(format_name "$use_case_name" "pascal")

    echo "import { LoggerMixin } from \"../../services\";"
    echo ""
    echo "class BaseGateway { constructor(...args: any[]) {} }"
    echo "export const Mix${formatted_name}Service = LoggerMixin(BaseGateway);"
}

# Função para criar o conteúdo do arquivo gateway do domínio
function create_domain_gateway_content {
    local use_case_name=$1
    local formatted_name=$(format_name "$use_case_name" "pascal")
    local entity_name=$(get_entity_name "$use_case_name")
    local method_name=$(format_name "$use_case_name" "camel")  # Nome do método em camelCase

    echo "import { I${entity_name}Repository, I${formatted_name}Gateway, ${formatted_name}GatewayParams, ${formatted_name}Data } from '../interfaces/';"
    echo "import { ${entity_name}Entity } from '../entities/${entity_name,,}.entity';"
    echo "import { Mix${formatted_name}Service } from '../../../adapters/gateways/${use_case_name}.gateway';"
    echo ""
    echo "export class ${formatted_name}Gateway extends Mix${formatted_name}Service implements I${formatted_name}Gateway {"
    echo "  ${entity_name,,}Repository: I${entity_name}Repository;"
    echo ""
    echo "  constructor(params: ${formatted_name}GatewayParams) {"
    echo "    super();"
    echo "    this.${entity_name,,}Repository = params.repository;"
    echo "  }"
    echo ""
    echo "  async ${method_name}(data: ${formatted_name}Data): Promise<${entity_name}Entity> {"
    echo "    return this.${entity_name,,}Repository.create(data);"
    echo "  }"
    echo "}"
}

# Função para criar o conteúdo do arquivo de interface
function create_interface_content {
    local use_case_name=$1
    local formatted_name=$(format_name "$use_case_name" "pascal")
    local entity_name=$(get_entity_name "$use_case_name")

    echo "import logger from '../../../config/logger';"
    echo "import { ${entity_name}Entity } from '../entities/${entity_name,,}.entity';"
    echo "import { I${entity_name}Repository } from './${entity_name,,}.interface';"
    echo ""
    echo "export type Input${formatted_name} = {"
    echo "  // Defina os campos de entrada aqui"
    echo "};"
    echo ""
    echo "export type ${formatted_name}Data = {"
    echo "  // Defina os campos de dados aqui"
    echo "};"
    echo ""
    echo "export type ${formatted_name}GatewayParams = {"
    echo "  repository: I${entity_name}Repository;"
    echo "  logger: typeof logger;"
    echo "};"
    echo ""
    echo "export interface I${formatted_name}Gateway {"
    echo "  ${use_case_name}(data: ${formatted_name}Data): Promise<${entity_name}Entity>;"
    echo "  loggerInfo(message: string, data?: unknown): void;"
    echo "  loggerErro(message: string, data?: unknown): void;"
    echo "}"
}

# Função para verificar se o caso de uso já existe
function use_case_exists {
    local use_case_name=$1
    local domain_path=$2

    # Verifica se o arquivo do caso de uso já existe
    if [ -f "$domain_path/usecases/$use_case_name.interactor.ts" ]; then
        return 0  # Caso de uso já existe
    else
        return 1  # Caso de uso não existe
    fi
}

# Pergunta se deseja usar um domínio existente ou criar um novo
read -p "Deseja usar um domínio existente? (s/n): " use_existing_domain

if [[ "$use_existing_domain" == "s" ]]; then
    list_domains
    domain_name=$(select_domain)
    domain_path="src/domains/$domain_name"
    
    if [ ! -d "$domain_path" ]; then
        display_message "Dominio nao encontrado!"
        exit 1
    fi
else
    read -p "Digite o nome do novo domínio: " domain_name
    domain_path="src/domains/$domain_name"
    
    display_message "Criando dominio..."
    
    # Cria a estrutura de pastas dentro do novo domínio
    mkdir -p "$domain_path/adapter"
    mkdir -p "$domain_path/controllers"
    mkdir -p "$domain_path/entities"
    mkdir -p "$domain_path/factories"
    mkdir -p "$domain_path/gateways"
    mkdir -p "$domain_path/interfaces"
    mkdir -p "$domain_path/model"
    mkdir -p "$domain_path/repositories"
    mkdir -p "$domain_path/routes"
    mkdir -p "$domain_path/usecases"
    mkdir -p "$domain_path/validator"
    
    display_message "Dominio criado!"
fi

# Pergunta o nome do caso de uso
read -p "Digite o nome do caso de uso (ex: create.user): " use_case_name

# Verifica se o caso de uso já existe
if use_case_exists "$use_case_name" "$domain_path"; then
    display_message "Caso de uso ja existe!"
    exit 1
fi

# Cria o caso de uso dentro do domínio
use_case_path="$domain_path/usecases"
mkdir -p "$use_case_path"

# Cria os arquivos necessários
display_message "Criando arquivos..."

# Arquivo na pasta usecases
create_interactor_content "$use_case_name" > "$use_case_path/$use_case_name.interactor.ts"

# Arquivo na pasta interfaces
create_interface_content "$use_case_name" > "$domain_path/interfaces/$use_case_name.interface.ts"

# Arquivo na pasta gateways
create_domain_gateway_content "$use_case_name" > "$domain_path/gateways/$use_case_name.gateway.ts"

# Arquivo na pasta factories
echo "// ${use_case_name}.factory.ts" > "$domain_path/factories/$use_case_name.factory.ts"

# Arquivo na pasta controllers
create_controller_content "$use_case_name" > "$domain_path/controllers/$use_case_name.controller.ts"

# Cria o arquivo gateway na pasta src/adapters/gateway
adapter_gateway_path="src/adapters/gateways"
mkdir -p "$adapter_gateway_path"
create_gateway_content "$use_case_name" > "$adapter_gateway_path/$use_case_name.gateway.ts"

display_message "Arquivos criados!"

# Exibe a estrutura criada
tree "$domain_path" | lolcat
tree "$adapter_gateway_path" | lolcat