DROP TABLE IF EXISTS installments;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS cards;
DROP TYPE IF EXISTS card_type;
DROP TABLE IF EXISTS users;

-- =============================================
--          TABELA DE USUÁRIOS (já existente, mas incluída para completude)
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
--          TABELA DE CARTÕES (crédito ou débito)
-- =============================================
CREATE TYPE card_type AS ENUM ('credito', 'debito');

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,  -- ex: "Cartão Nubank"
    description TEXT,            -- ex: "Cartão principal para despesas diárias"
    type card_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
--          TABELA DE CONTAS (gastos/despesas)
-- =============================================
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,              -- ex: "Lanche no McDonald's"
    location VARCHAR(255),                  -- ex: "Shopping Center"
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),  -- valor do gasto
    paid_with_card BOOLEAN DEFAULT FALSE,   -- foi pago com cartão?
    card_id INTEGER REFERENCES cards(id) ON DELETE SET NULL,  -- id do cartão, se aplicável (pode ser NULL)
    payment_date DATE NOT NULL,             -- data do pagamento/gasto
    is_split BOOLEAN DEFAULT FALSE,         -- foi dividido com outras pessoas? (booleano simples; se precisar de mais detalhes, crie tabela separada)
    is_installment BOOLEAN DEFAULT FALSE,   -- foi parcelado?
    num_installments INTEGER CHECK (num_installments > 0),  -- número de parcelas, se aplicável (pode ser NULL ou >1 se is_installment=true)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Constraint adicional: se paid_with_card=true, card_id não pode ser NULL
ALTER TABLE accounts ADD CONSTRAINT check_card_id_if_paid_with_card
    CHECK (NOT paid_with_card OR card_id IS NOT NULL);

-- Constraint: se is_installment=true, num_installments deve ser >1
ALTER TABLE accounts ADD CONSTRAINT check_num_installments_if_installment
    CHECK (NOT is_installment OR num_installments > 1);

-- =============================================
--          TABELA DE PARCELAS (para contas parceladas)
-- =============================================
CREATE TABLE installments (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    installment_number INTEGER NOT NULL CHECK (installment_number > 0),  -- ex: 1, 2, 3...
    is_paid BOOLEAN DEFAULT FALSE,          -- status: já foi pago?
    card_id INTEGER REFERENCES cards(id) ON DELETE SET NULL,  -- cartão associado (pode herdar da conta, mas permite override)
    due_date DATE NOT NULL,                 -- data de vencimento da parcela
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),  -- valor da parcela (calculado como account.amount / num_installments, mas armazenado para flexibilidade)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Garantir unicidade por conta + número da parcela
    UNIQUE (account_id, installment_number)
);

-- =============================================
--          ÍNDICES ÚTEIS PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_payment_date ON accounts(payment_date);
CREATE INDEX idx_accounts_card_id ON accounts(card_id);
CREATE INDEX idx_installments_account_id ON installments(account_id);
CREATE INDEX idx_installments_due_date ON installments(due_date);

-- =============================================
--          TRIGGER PARA ATUALIZAR updated_at (opcional, mas útil)
-- =============================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas principais
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cards_timestamp
BEFORE UPDATE ON cards
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_accounts_timestamp
BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_installments_timestamp
BEFORE UPDATE ON installments
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =============================================
--          EXEMPLO DE INSERTS PARA TESTE
-- =============================================

-- Inserir usuário
INSERT INTO users (name, email, password) VALUES ('João Silva', 'joao@example.com', 'hashed_password');

-- Inserir cartão
INSERT INTO cards (user_id, name, description, type) VALUES (1, 'Cartão Crédito Nubank', 'Cartão principal', 'credito');

-- Inserir conta simples (sem parcela)
INSERT INTO accounts (user_id, description, location, amount, paid_with_card, card_id, payment_date, is_split, is_installment, num_installments)
VALUES (1, 'Lanche no bar', 'Bar do Zé', 50.00, TRUE, 1, '2026-01-14', FALSE, FALSE, NULL);

-- Inserir conta parcelada
INSERT INTO accounts (user_id, description, location, amount, paid_with_card, card_id, payment_date, is_split, is_installment, num_installments)
VALUES (1, 'Compra de celular', 'Loja Online', 1200.00, TRUE, 1, '2026-01-14', FALSE, TRUE, 3);

-- Inserir parcelas para a conta acima (id=2, assumindo auto-increment)
INSERT INTO installments (account_id, installment_number, is_paid, card_id, due_date, amount)
VALUES 
(2, 1, TRUE, 1, '2026-02-10', 400.00),
(2, 2, FALSE, 1, '2026-03-10', 400.00),
(2, 3, FALSE, 1, '2026-04-10', 400.00);
