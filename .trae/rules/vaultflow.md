# Relacionamento entre Tabelas – Modelo Financeiro

Este documento descreve o relacionamento entre as tabelas do banco de dados responsável pelo controle de usuários, cartões, contas (gastos) e parcelas.

---

## Visão Geral do Modelo

O banco de dados foi projetado para registrar **gastos financeiros de usuários**, permitindo:

- Uso de cartões de crédito ou débito
- Controle de contas simples ou parceladas
- Acompanhamento individual de parcelas
- Integridade referencial entre os dados

As principais tabelas são:

- `users`
- `cards`
- `accounts`
- `installments`

---

## 1. Tabela `users`

### Descrição
Armazena os usuários do sistema.

### Relacionamentos
- **1:N com `cards`**
- **1:N com `accounts`**

### Detalhes
- Um usuário pode possuir **vários cartões**
- Um usuário pode possuir **várias contas (gastos)**
- Se um usuário for excluído, **todos os cartões e contas associadas também serão excluídos** (`ON DELETE CASCADE`)

---

## 2. Tabela `cards`

### Descrição
Armazena os cartões do usuário, podendo ser de **crédito** ou **débito**.

### Relacionamentos
- **N:1 com `users`**
- **1:N com `accounts`**
- **1:N com `installments`**

### Detalhes
- Cada cartão pertence a **um único usuário**
- Um cartão pode ser utilizado em **várias contas**
- Um cartão pode estar associado a **várias parcelas**
- Caso um cartão seja excluído:
  - O campo `card_id` nas tabelas `accounts` e `installments` será definido como `NULL` (`ON DELETE SET NULL`)
- Um usuário pode ter vários cartões, mas cada cartão pertence a apenas um usuário.

---

## 3. Tabela `accounts`

### Descrição
Representa os **gastos/despesas** do usuário, que podem ser simples ou parcelados.

### Relacionamentos
- **N:1 com `users`**
- **N:1 opcional com `cards`**
- **1:N com `installments`**

### Detalhes
- Cada conta pertence a **um usuário**
- Uma conta **pode ou não** estar associada a um cartão
- Uma conta pode gerar **nenhuma ou várias parcelas**
- Regras importantes:
  - Se `paid_with_card = true`, então `card_id` **não pode ser NULL**
  - Se `is_installment = true`, então `num_installments` deve ser maior que 1

---

## 4. Tabela `installments`

### Descrição
Armazena as **parcelas** de uma conta parcelada.

### Relacionamentos
- **N:1 com `accounts`**
- **N:1 opcional com `cards`**

### Detalhes
- Cada parcela pertence a **uma única conta**
- Uma conta pode possuir **várias parcelas**
- Cada parcela pode:
  - Herdar o cartão da conta
  - Ou utilizar um cartão diferente (override)
- A combinação `(account_id, installment_number)` é única, garantindo que não existam parcelas duplicadas

---

## Regras de Integridade Referencial

| Origem        | Destino        | Regra ao Deletar |
|---------------|---------------|-----------------|
| users → cards | CASCADE       | Remove cartões do usuário |
| users → accounts | CASCADE   | Remove contas do usuário |
| accounts → installments | CASCADE | Remove parcelas da conta |
| cards → accounts | SET NULL | Mantém a conta sem cartão |
| cards → installments | SET NULL | Mantém a parcela sem cartão |

---

## Resumo dos Relacionamentos

