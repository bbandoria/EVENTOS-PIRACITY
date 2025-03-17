import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { checkPublicAccess } from '@/services/supabase';
import { toast } from 'sonner';

interface AccessCheckResult {
  hasPublicAccess: boolean;
  tables: {
    events: { exists: boolean; error: string | null; policies: any[] };
    venues: { exists: boolean; error: string | null; policies: any[] };
  };
  details: string;
}

export function AccessPolicyCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [accessStatus, setAccessStatus] = useState<AccessCheckResult | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [showRpcInfo, setShowRpcInfo] = useState(false);

  const checkAccess = async () => {
    setIsChecking(true);
    try {
      const result = await checkPublicAccess();
      setAccessStatus(result);
      if (result.hasPublicAccess) {
        toast.success('Acesso público configurado corretamente!');
      } else {
        toast.error('Acesso público não configurado corretamente.');
      }
      
      // Verificar se houve erro de RPC não encontrada
      const eventsError = result.tables.events.error;
      const venuesError = result.tables.venues.error;
      const hasRpcError = 
        (eventsError && eventsError.includes('get_policies_info')) || 
        (venuesError && venuesError.includes('get_policies_info'));
      
      if (hasRpcError) {
        setShowRpcInfo(true);
      }
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setAccessStatus(null);
      toast.error('Erro ao verificar acesso público.');
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = () => {
    const sqlScript = `-- Script SQL simplificado para configurar acesso público aos eventos
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
FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sqlScript)
      .then(() => toast.success('SQL copiado para a área de transferência!'))
      .catch(() => toast.error('Erro ao copiar SQL.'));
  };

  const copyRpcScript = () => {
    const rpcScript = `-- Função para verificar as políticas de acesso de uma tabela
-- Execute este script no SQL Editor do Supabase

-- Criar função para obter informações sobre as políticas de uma tabela
CREATE OR REPLACE FUNCTION get_policies_info(table_name text)
RETURNS TABLE (
  policyname text,
  permissive text,
  roles text[],
  cmd text,
  qual text,
  with_check text
) LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.policyname::text,
    p.permissive::text,
    p.roles::text[],
    p.cmd::text,
    p.qual::text,
    p.with_check::text
  FROM pg_policies p
  WHERE p.tablename = table_name;
END;
$$;

-- Conceder permissão para executar a função anonimamente
GRANT EXECUTE ON FUNCTION get_policies_info(text) TO anon;`;

    navigator.clipboard.writeText(rpcScript)
      .then(() => toast.success('Script RPC copiado para a área de transferência!'))
      .catch(() => toast.error('Erro ao copiar script.'));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            {accessStatus?.hasPublicAccess === true ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            Status de Acesso Público
          </CardTitle>
        </div>
        <CardDescription>
          Verificação das políticas de acesso público no Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {accessStatus?.hasPublicAccess === true ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Acesso público configurado</AlertTitle>
              <AlertDescription>
                As políticas de acesso público estão configuradas corretamente. Usuários não logados podem visualizar os eventos.
              </AlertDescription>
            </Alert>
          ) : accessStatus?.hasPublicAccess === false ? (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Acesso público não configurado</AlertTitle>
              <AlertDescription>
                {accessStatus.details || 'As políticas de acesso público não estão configuradas corretamente. Usuários não logados não podem visualizar os eventos.'}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verificando acesso...</AlertTitle>
              <AlertDescription>
                Aguarde enquanto verificamos as políticas de acesso.
              </AlertDescription>
            </Alert>
          )}

          {showRpcInfo && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle>Função RPC não encontrada</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  A função <code>get_policies_info</code> não foi encontrada no Supabase. Esta função é necessária para verificar as políticas de acesso.
                </p>
                <p>
                  Você pode continuar usando a aplicação normalmente, mas para verificar as políticas de acesso em detalhes, execute o script SQL abaixo no SQL Editor do Supabase.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRpcInfo(!showRpcInfo)}
                  className="mt-2"
                >
                  {showRpcInfo ? 'Ocultar Script RPC' : 'Mostrar Script RPC'}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {showRpcInfo && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Script para criar função RPC:</h3>
                <Button variant="ghost" size="sm" onClick={copyRpcScript}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`-- Função para verificar as políticas de acesso de uma tabela
-- Execute este script no SQL Editor do Supabase

-- Criar função para obter informações sobre as políticas de uma tabela
CREATE OR REPLACE FUNCTION get_policies_info(table_name text)
RETURNS TABLE (
  policyname text,
  permissive text,
  roles text[],
  cmd text,
  qual text,
  with_check text
) LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.policyname::text,
    p.permissive::text,
    p.roles::text[],
    p.cmd::text,
    p.qual::text,
    p.with_check::text
  FROM pg_policies p
  WHERE p.tablename = table_name;
END;
$$;

-- Conceder permissão para executar a função anonimamente
GRANT EXECUTE ON FUNCTION get_policies_info(text) TO anon;`}
              </pre>
            </div>
          )}

          {accessStatus && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Detalhes das Tabelas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-3">
                  <h4 className="font-medium mb-2">Tabela: events</h4>
                  <div>
                    <div className="mb-1">
                      <span className="font-medium">Existe:</span> {accessStatus.tables.events.exists ? 'Sim' : 'Não'}
                    </div>
                    {accessStatus.tables.events.error && (
                      <div className="mb-1 text-red-600">
                        <span className="font-medium">Erro:</span> {accessStatus.tables.events.error}
                      </div>
                    )}
                    <div className="mb-1">
                      <span className="font-medium">Políticas:</span> {accessStatus.tables.events.policies?.length || 0}
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-3">
                  <h4 className="font-medium mb-2">Tabela: venues</h4>
                  <div>
                    <div className="mb-1">
                      <span className="font-medium">Existe:</span> {accessStatus.tables.venues.exists ? 'Sim' : 'Não'}
                    </div>
                    {accessStatus.tables.venues.error && (
                      <div className="mb-1 text-red-600">
                        <span className="font-medium">Erro:</span> {accessStatus.tables.venues.error}
                      </div>
                    )}
                    <div className="mb-1">
                      <span className="font-medium">Políticas:</span> {accessStatus.tables.venues.policies?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4">
            <Button 
              onClick={checkAccess} 
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? 'Verificando...' : 'Verificar Novamente'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setShowSql(!showSql)}
              className="w-full"
            >
              {showSql ? 'Ocultar SQL' : 'Mostrar SQL para Correção'}
            </Button>
          </div>

          {showSql && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">SQL para Configurar Acesso Público:</h3>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copiar
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`-- Script SQL simplificado para configurar acesso público aos eventos
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
FOR SELECT USING (true);`}
              </pre>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    Abrir Supabase Dashboard
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 