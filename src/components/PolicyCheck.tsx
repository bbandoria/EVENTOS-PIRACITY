import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { RpcFunctionInfo } from './RpcFunctionInfo';

interface Policy {
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

interface TablePolicies {
  tableName: string;
  policies: Policy[];
  error: string | null;
  loading: boolean;
}

export function PolicyCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tablePolicies, setTablePolicies] = useState<TablePolicies[]>([]);
  const [anonClient, setAnonClient] = useState<any>(null);

  useEffect(() => {
    // Criar cliente anônimo do Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );
      setAnonClient(client);
    }
  }, []);

  const checkPolicies = async () => {
    if (!anonClient) return;
    
    setLoading(true);
    const tables = ['events', 'venues', 'favorites'];
    const policiesData: TablePolicies[] = [];

    for (const tableName of tables) {
      try {
        console.log(`Verificando políticas para a tabela ${tableName}...`);
        
        const { data, error } = await anonClient.rpc('get_policies_info', {
          table_name: tableName
        });

        if (error) {
          console.error(`Erro ao verificar políticas para ${tableName}:`, error);
          
          // Verificar se é o erro 404 (função não encontrada)
          if (error.code === 'PGRST202' && error.message.includes('Could not find the function')) {
            policiesData.push({
              tableName,
              policies: [],
              error: `Função RPC 'get_policies_info' não encontrada. Execute o script SQL para criar a função.`,
              loading: false
            });
          } else {
            policiesData.push({
              tableName,
              policies: [],
              error: `Erro ao verificar políticas: ${error.message}`,
              loading: false
            });
          }
        } else {
          console.log(`Políticas para ${tableName}:`, data);
          policiesData.push({
            tableName,
            policies: data || [],
            error: null,
            loading: false
          });
        }
      } catch (err: any) {
        console.error(`Erro ao verificar políticas para ${tableName}:`, err);
        policiesData.push({
          tableName,
          policies: [],
          error: `Erro ao verificar políticas: ${err.message}`,
          loading: false
        });
      }
    }

    setTablePolicies(policiesData);
    setLoading(false);
  };

  const getPolicyCommandLabel = (cmd: string) => {
    switch (cmd) {
      case 'SELECT': return 'Leitura';
      case 'INSERT': return 'Inserção';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      case 'ALL': return 'Todas operações';
      default: return cmd;
    }
  };

  const getPolicyCommandColor = (cmd: string) => {
    switch (cmd) {
      case 'SELECT': return 'bg-blue-100 text-blue-800';
      case 'INSERT': return 'bg-green-100 text-green-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'ALL': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPolicies = (tablePolicies: TablePolicies) => {
    if (tablePolicies.loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span>Verificando políticas...</span>
        </div>
      );
    }

    if (tablePolicies.error) {
      // Verificar se é o erro específico de função RPC não encontrada
      if (tablePolicies.error.includes('função RPC') || 
          tablePolicies.error.includes('get_policies_info') ||
          tablePolicies.error.includes('Could not find the function')) {
        return (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Função RPC não encontrada</AlertTitle>
            <AlertDescription>
              <p>A função <code>get_policies_info</code> não foi encontrada no Supabase. Esta função é necessária para verificar as políticas de acesso.</p>
              <p className="mt-2">Veja o componente <strong>RpcFunctionInfo</strong> para obter o script SQL necessário para criar esta função.</p>
            </AlertDescription>
          </Alert>
        );
      }
      
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            {tablePolicies.error}
          </AlertDescription>
        </Alert>
      );
    }

    if (tablePolicies.policies.length === 0) {
      return (
        <Alert className="mt-2 bg-yellow-50 border-yellow-200">
          <Info className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Sem políticas</AlertTitle>
          <AlertDescription>
            Nenhuma política de acesso encontrada para esta tabela. 
            Isso pode causar problemas de acesso para usuários não autenticados.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-3 mt-2">
        {tablePolicies.policies.map((policy, index) => (
          <Card key={index} className="border border-gray-200">
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">{policy.policyname}</CardTitle>
                <Badge variant="outline" className={`${policy.permissive === 'PERMISSIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {policy.permissive}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Roles: {policy.roles.join(', ')}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <Badge className={getPolicyCommandColor(policy.cmd)}>
                    {getPolicyCommandLabel(policy.cmd)}
                  </Badge>
                </div>
                {policy.qual && (
                  <div className="text-xs">
                    <span className="font-semibold">Condição:</span> 
                    <code className="ml-1 p-1 bg-gray-100 rounded">{policy.qual}</code>
                  </div>
                )}
                {policy.with_check && (
                  <div className="text-xs">
                    <span className="font-semibold">Verificação:</span> 
                    <code className="ml-1 p-1 bg-gray-100 rounded">{policy.with_check}</code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && tablePolicies.length === 0) {
            checkPolicies();
          }
        }}
      >
        <span>Verificar Políticas de Acesso</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
      </Button>

      {isOpen && (
        <div className="mt-2 border rounded-md p-4 bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Políticas de Acesso do Supabase</h3>
            <p className="text-sm text-gray-600 mt-1">
              Verifica as políticas de acesso configuradas para as tabelas no Supabase.
              Políticas adequadas são essenciais para permitir acesso público aos eventos.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Verificando políticas...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {tablePolicies.length === 0 ? (
                <Button onClick={checkPolicies} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar Políticas'
                  )}
                </Button>
              ) : (
                tablePolicies.map((tablePolicy, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <h4 className="text-md font-medium mb-2">Tabela: {tablePolicy.tableName}</h4>
                    {renderPolicies(tablePolicy)}
                  </div>
                ))
              )}

              {tablePolicies.length > 0 && (
                <div className="mt-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Dica</AlertTitle>
                    <AlertDescription>
                      Para acesso público aos eventos, certifique-se de que as tabelas 'events' e 'venues' 
                      tenham políticas de SELECT para o role 'anon'. Execute o script SQL de políticas 
                      disponível na aplicação para configurar corretamente.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 