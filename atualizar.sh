#!/bin/bash

echo ""
echo "🔄 Atualizando repositório..."
echo ""

git add .
git commit -m "Atualização automática"
git push

echo ""
echo "✅ Repositório atualizado com sucesso!"
