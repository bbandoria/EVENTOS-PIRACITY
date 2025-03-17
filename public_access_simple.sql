-- Script SQL simplificado para configurar acesso público aos eventos
-- Execute este script no SQL Editor do Supabase

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura pública de eventos" ON events;
DROP POLICY IF EXISTS "Permitir leitura pública de locais" ON venues;

-- Habilitar RLS (Row Level Security) nas tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública de eventos
CREATE POLICY "Permitir leitura pública de eventos" ON events
FOR SELECT USING (true);

-- Política para permitir leitura pública de locais
CREATE POLICY "Permitir leitura pública de locais" ON venues
FOR SELECT USING (true);

-- Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'events';
SELECT * FROM pg_policies WHERE tablename = 'venues'; 