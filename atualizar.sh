#!/bin/bash

echo ""
echo "🔄 Atualizando repositório..."
echo ""

git add .
git commit -m "Atualização automática"

echo ""
echo "📤 Enviando para o repositório remoto..."
echo ""

if git push; then
  echo ""
  echo "✅ Repositório atualizado com sucesso!"
else
  echo ""
  echo "❌ Falha ao enviar para o repositório remoto."
  echo "ℹ️  Verifique se há conflitos ou se precisa fazer um git pull --rebase"
fi