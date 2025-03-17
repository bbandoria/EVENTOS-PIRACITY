-- Políticas de acesso público para a tabela events
-- Execute este script no SQL Editor do Supabase para permitir acesso público aos eventos

-- Política para permitir leitura pública de eventos
CREATE POLICY "Permitir leitura pública de eventos" ON events
FOR SELECT USING (true);

-- Política para permitir leitura pública de locais
CREATE POLICY "Permitir leitura pública de locais" ON venues
FOR SELECT USING (true);

-- Política para permitir que usuários autenticados criem eventos
CREATE POLICY "Permitir usuários autenticados criar eventos" ON events
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que usuários autenticados atualizem seus próprios eventos
CREATE POLICY "Permitir usuários autenticados atualizar seus próprios eventos" ON events
FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que usuários autenticados excluam seus próprios eventos
CREATE POLICY "Permitir usuários autenticados excluir seus próprios eventos" ON events
FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Política para permitir que usuários autenticados criem locais
CREATE POLICY "Permitir usuários autenticados criar locais" ON venues
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que usuários autenticados atualizem seus próprios locais
CREATE POLICY "Permitir usuários autenticados atualizar seus próprios locais" ON venues
FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que usuários autenticados excluam seus próprios locais
CREATE POLICY "Permitir usuários autenticados excluir seus próprios locais" ON venues
FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Nota: Se as políticas já existirem, você pode precisar excluí-las primeiro com:
-- DROP POLICY IF EXISTS "nome_da_politica" ON nome_da_tabela; 