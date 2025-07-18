#!/bin/sh
# Cores
GREEN='\033[1;32m'
BLUE='\033[1;34m'
NC='\033[0m'
clear
printf "${BLUE}==========================================\n"
printf "${GREEN}     ⌛ Atualizando bot Sanizinha...     \n"
printf "${BLUE}==========================================${NC}\n"
sleep 1
# Adiciona exceção para o diretório
git config --global --add safe.directory /storage/emulated/0/SanizinhaBot
# Vai para a pasta do bot
cd /storage/emulated/0/SanizinhaBot || exit
# Atualiza o repositório com rebase para evitar conflito de branches
git pull --rebase origin main
# Mensagem final
printf "${GREEN}✅ BOT ATUALIZADO COM SUCESSO! 💕😻✨${NC}\n"
printf "${BLUE}🚀 Iniciando o bot...${NC}\n"
# Inicia o bot
sh sani.sh
