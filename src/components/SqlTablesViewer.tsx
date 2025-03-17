import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Database, Check } from 'lucide-react';

export function SqlTablesViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Criação da tabela venues
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela favorites
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Políticas de segurança para venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venues são visíveis para todos"
  ON venues FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir venues"
  ON venues FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas de segurança para events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events são visíveis para todos"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Políticas de segurança para favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver apenas seus próprios favoritos"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas seus próprios favoritos"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar apenas seus próprios favoritos"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-100 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Database className="h-4 w-4 mr-2" />
        SQL Tables
      </Button>
    );
  }

  return (
    <div className="fixed bottom-100 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Script SQL para Criar Tabelas</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Instruções</h4>
              <p className="text-xs text-blue-700 mt-1">
                Execute este script SQL no painel do Supabase para criar as tabelas necessárias para o funcionamento da aplicação.
              </p>
              <ol className="text-xs text-blue-700 mt-2 list-decimal pl-4 space-y-1">
                <li>Acesse o painel do Supabase</li>
                <li>Vá para a seção "SQL Editor"</li>
                <li>Clique em "New Query"</li>
                <li>Cole o script abaixo</li>
                <li>Clique em "Run" para executar o script</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
            {sqlScript}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Nota</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Este script cria as tabelas venues, events e favorites com suas respectivas políticas de segurança.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Certifique-se de que a extensão uuid-ossp está habilitada no seu banco de dados Supabase antes de executar este script.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 