#!/bin/bash
# Cores para o terminal
GREEN='\033[1;32m'
BLUE='\033[1;34m'
NC='\033[0m' # Sem cor

clear
echo -e "${BLUE}=========================================="
echo -e "${GREEN}     🔄 Atualizando bot Sanizinha...     "
echo -e "${BLUE}==========================================${NC}"
sleep 1

# Adiciona exceção para o diretório
git config --global --add safe.directory /storage/emulated/0/SanizinhaBot

# Atualizando o repositório
git pull origin main

echo -e "${GREEN}✅ Bot atualizado com sucesso!${NC}"