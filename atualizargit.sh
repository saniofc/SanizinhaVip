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
  echo "⚠️  Push rejeitado. Tentando git pull --rebase automaticamente..."
  echo ""
  git pull --rebase

  echo ""
  echo "📤 Tentando enviar novamente..."
  echo ""

  if git push; then
    echo ""
    echo "✅ Repositório atualizado com sucesso após rebase!"
  else
    echo ""
    echo "❌ Ainda falhou ao enviar após rebase."
    echo "   ➤ Verifique conflitos ou mensagens de erro acima."
  fi
fi