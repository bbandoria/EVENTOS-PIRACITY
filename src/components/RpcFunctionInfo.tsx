import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronDown, ChevronUp, Copy, Check, AlertCircle, Database } from 'lucide-react';

export function RpcFunctionInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Função para verificar as políticas de acesso de uma tabela
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
GRANT EXECUTE ON FUNCTION get_policies_info(text) TO anon;

-- Verificar se a função foi criada corretamente
SELECT * FROM pg_proc WHERE proname = 'get_policies_info';

-- Testar a função
SELECT * FROM get_policies_info('events');
SELECT * FROM get_policies_info('venues');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Função RPC para Verificar Políticas
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Card className="mt-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Função RPC para Verificar Políticas</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              Execute este script no SQL Editor do Supabase para criar a função RPC que verifica políticas de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro 404 na verificação de políticas</AlertTitle>
              <AlertDescription>
                Se você está vendo erros 404 ao verificar políticas, é porque a função RPC <code>get_policies_info</code> ainda não foi criada no Supabase.
                Execute o script abaixo no SQL Editor do Supabase para criar a função.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">
                {sqlScript}
              </pre>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Nota:</strong> Esta função permite verificar as políticas de acesso configuradas para as tabelas no Supabase.
                Após executar o script, a função estará disponível para uso pela aplicação.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 