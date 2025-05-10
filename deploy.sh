#!/bin/bash

# Configurações
LOG_FILE="/var/log/gunno-deploy.log"
PROJECT_DIR="/opt/backend"  # Ajuste para o caminho do seu projeto

# Função para log
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
  echo "$1"
}

# Ir para o diretório do projeto
cd $PROJECT_DIR || { log "Erro: Não foi possível acessar o diretório $PROJECT_DIR"; exit 1; }

# 1. Atualizar repositório
log "Executando git fetch..."
git fetch || { log "Erro no git fetch"; exit 1; }

log "Executando git reset..."
git reset --hard origin/main || { log "Erro no git reset"; exit 1; }

# 2. Instalar dependências
log "Executando npm install..."
npm install || { log "Erro no npm install"; exit 1; }

# 3. Build e migrações
log "Executando npm run deploy..."
npm run deploy || { log "Erro no npm run deploy"; exit 1; }

# 4. Reiniciar aplicação
log "Executando pm2 restart..."
npm run pm2:restart || { log "Erro ao reiniciar pm2"; exit 1; }

log "Deploy concluído com sucesso!"
exit 0