# Instruções de Operação - VaultFlow

Este documento contém os comandos essenciais para gerenciar o ambiente de desenvolvimento Docker e o banco de dados.

## 🐳 Gerenciamento do Docker

Certifique-se de estar na pasta raiz do projeto (`VaultFlow`) no seu terminal.

### Ligar (Iniciar o ambiente)
Inicia todos os serviços (App Vue.js e PostgreSQL) em segundo plano.
```powershell
docker compose up -d
```
> O Frontend estará disponível em: http://localhost:5173

### Reiniciar
Se você precisar apenas reiniciar os serviços:
```powershell
docker compose restart
```

Se você fez alterações no `Dockerfile` ou precisa reconstruir as imagens:
```powershell
docker compose up -d --build
```

### Desligar
Para parar todos os serviços e remover os containers:
```powershell
docker compose down
```

---

## 🗄️ Banco de Dados

### Atualizar / Resetar Banco de Dados
Para apagar todos os dados atuais e recriar as tabelas com os dados iniciais (definidos em `init.sql`), execute o script PowerShell:

```powershell
.\update_db.ps1
```

**O que este comando faz:**
1. Conecta-se ao container do banco de dados (`vaultflow-db-1`).
2. Executa o arquivo `init.sql`.
3. Remove tabelas antigas, cria novas e insere dados de teste.

---

## 🔐 Segurança e Autenticação

### Regras de Validação de Usuário
O sistema implementa validações rigorosas no frontend (`useFormValidation.js`) e testes unitários.

**Senha:**
- Mínimo de 8 caracteres
- Pelo menos 1 letra maiúscula (`A-Z`)
- Pelo menos 1 letra minúscula (`a-z`)
- Pelo menos 1 número (`0-9`)
- Pelo menos 1 caractere especial (`!@#$%^&*...`)

**Email:**
- Formato padrão de email (regex).

### Requisitos de Backend (Implementação Futura)
Para garantir a segurança completa, o backend deve implementar:
- **Hash de Senha:** Utilizar algoritmos fortes como Argon2 ou bcrypt com salt.
- **CSRF:** Tokens anti-CSRF em todas as requisições de mutação (POST, PUT, DELETE).
- **Rate Limiting:** Proteção contra força bruta no login.

### Testes
Para rodar os testes unitários das validações:
```bash
npm run test
```
