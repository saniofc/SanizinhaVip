#!/bin/sh
# Cores
GREEN='\033[1;32m'
BLUE='\033[1;34m'
NC='\033[0m'

clear
printf "${BLUE}==========================================\n"
printf "${GREEN}     ⌛ Atualizando Sanizinha...     \n"
printf "${BLUE}==========================================${NC}\n"
sleep 1

# Define pasta
BOT_DIR="/storage/emulated/0/SanizinhaBot"

# Adiciona exceção para o diretório
git config --global --add safe.directory "$BOT_DIR"

# Vai para a pasta
cd "$BOT_DIR" || exit

# Remove todas alterações locais e força o conteúdo do repositório remoto
git fetch origin
git reset --hard origin/main

# Limpa arquivos que não estão no repositório
git clean -fd

# Mensagem final
printf "${GREEN}✅ BOT ATUALIZADO COM SUCESSO😻💕✨${NC}\n"
printf "${BLUE}🚀 Iniciando o bot...${NC}\n"

# Inicia o bot
sh sani.sh
