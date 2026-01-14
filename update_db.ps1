# Comando para atualizar o banco de dados
Write-Host "Atualizando banco de dados a partir de init.sql..."
docker compose exec -T db psql -U admin -d vaultflow -f /docker-entrypoint-initdb.d/init.sql
if ($?) {
    Write-Host "Banco de dados atualizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro ao atualizar banco de dados." -ForegroundColor Red
}
