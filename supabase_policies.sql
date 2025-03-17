-- Script para configurar políticas de acesso no Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela events
-- Permitir leitura pública (SELECT) para todos os usuários, incluindo anônimos
CREATE POLICY "Permitir leitura pública de eventos" 
  ON events FOR SELECT 
  USING (true);

-- Permitir que usuários autenticados criem seus próprios eventos
CREATE POLICY "Permitir usuários autenticados criar eventos" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Permitir que usuários autenticados atualizem seus próprios eventos
CREATE POLICY "Permitir usuários autenticados atualizar seus eventos" 
  ON events FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Permitir que usuários autenticados excluam seus próprios eventos
CREATE POLICY "Permitir usuários autenticados excluir seus eventos" 
  ON events FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Políticas para a tabela venues
-- Permitir leitura pública (SELECT) para todos os usuários, incluindo anônimos
CREATE POLICY "Permitir leitura pública de locais" 
  ON venues FOR SELECT 
  USING (true);

-- Permitir que usuários autenticados criem seus próprios locais
CREATE POLICY "Permitir usuários autenticados criar locais" 
  ON venues FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Permitir que usuários autenticados atualizem seus próprios locais
CREATE POLICY "Permitir usuários autenticados atualizar seus locais" 
  ON venues FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Permitir que usuários autenticados excluam seus próprios locais
CREATE POLICY "Permitir usuários autenticados excluir seus locais" 
  ON venues FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Políticas para a tabela favorites
-- Permitir que usuários autenticados vejam seus próprios favoritos
CREATE POLICY "Permitir usuários autenticados ver seus favoritos" 
  ON favorites FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Permitir que usuários autenticados adicionem favoritos
CREATE POLICY "Permitir usuários autenticados adicionar favoritos" 
  ON favorites FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados removam seus próprios favoritos
CREATE POLICY "Permitir usuários autenticados remover seus favoritos" 
  ON favorites FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Verificar as políticas criadas
SELECT * FROM pg_policies WHERE tablename IN ('events', 'venues', 'favorites'); 