import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { SqlExecutionStatus } from './SqlExecutionStatus';

// Script SQL para criar as tabelas
const SQL_SCRIPT = `-- Tabela venues
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
CREATE POLICY events_update_policy ON events FOR UPDATE USING (true);`;

export function SqlScriptViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExecutionStatus, setShowExecutionStatus] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT)
      .then(() => {
        toast.success('Script SQL copiado para a área de transferência');
      })
      .catch((err) => {
        console.error('Erro ao copiar script:', err);
        toast.error('Erro ao copiar script');
      });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-28 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Code className="h-4 w-4 mr-2" />
        SQL Script
      </Button>
    );
  }

  return (
    <div className="fixed bottom-28 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Script SQL para Criar Tabelas</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            Copiar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-amber-800">
              <strong>Nota importante:</strong> Este script foi atualizado para corrigir um erro de sintaxe. 
              A sintaxe <code className="bg-amber-100 px-1 rounded">IF NOT EXISTS</code> não é suportada para políticas no PostgreSQL.
              Em vez disso, usamos <code className="bg-amber-100 px-1 rounded">DROP POLICY IF EXISTS</code> seguido por <code className="bg-amber-100 px-1 rounded">CREATE POLICY</code>.
            </p>
          </div>
        </div>
      </div>
      
      {showExecutionStatus ? (
        <SqlExecutionStatus onClose={() => setShowExecutionStatus(false)} />
      ) : (
        <>
          <div className="bg-muted p-3 rounded overflow-x-auto">
            <pre className="text-xs whitespace-pre-wrap">{SQL_SCRIPT}</pre>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Para usar este script:</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1">
              <li>Acesse o painel do Supabase</li>
              <li>Navegue até "SQL Editor"</li>
              <li>Crie uma nova query</li>
              <li>Cole este script</li>
              <li>Execute a query</li>
            </ol>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                onClick={() => setShowExecutionStatus(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Já executei o script
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 