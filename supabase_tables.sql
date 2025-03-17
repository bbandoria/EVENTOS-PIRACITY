-- Tabela venues
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  image_url TEXT,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  category TEXT,
  owner_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_venue_id_idx ON events(venue_id);
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_event_id_idx ON favorites(event_id);

-- Políticas de segurança para acesso anônimo
-- Permitir leitura anônima para venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS venues_select_policy ON venues;
CREATE POLICY venues_select_policy ON venues FOR SELECT USING (true);

-- Permitir leitura anônima para events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS events_select_policy ON events;
CREATE POLICY events_select_policy ON events FOR SELECT USING (true);

-- Permitir inserção anônima para venues (para testes)
DROP POLICY IF EXISTS venues_insert_policy ON venues;
CREATE POLICY venues_insert_policy ON venues FOR INSERT WITH CHECK (true);

-- Permitir inserção anônima para events (para testes)
DROP POLICY IF EXISTS events_insert_policy ON events;
CREATE POLICY events_insert_policy ON events FOR INSERT WITH CHECK (true);

-- Permitir atualização anônima para venues (para testes)
DROP POLICY IF EXISTS venues_update_policy ON venues;
CREATE POLICY venues_update_policy ON venues FOR UPDATE USING (true);

-- Permitir atualização anônima para events (para testes)
DROP POLICY IF EXISTS events_update_policy ON events;
CREATE POLICY events_update_policy ON events FOR UPDATE USING (true); 