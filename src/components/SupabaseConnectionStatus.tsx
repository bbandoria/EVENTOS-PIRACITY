import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Database, RefreshCw } from 'lucide-react';
import { supabase, eventsService } from '@/services/supabase';

export function SupabaseConnectionStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [eventsCount, setEventsCount] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    try {
      // Verificar autenticação
      const { data: session } = await supabase.auth.getSession();
      const authenticated = !!session?.session?.user;
      setIsAuthenticated(authenticated);
      console.log('Status de autenticação:', authenticated);

      // Verificar conexão básica
      const { data, error } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao verificar conexão:', error);
        setConnectionStatus({
          connected: false,
          error: error.message,
          details: JSON.stringify(error)
        });
      } else {
        console.log('Conexão verificada com sucesso');
        setConnectionStatus({
          connected: true,
          count: data?.length || 0
        });
      }

      // Verificar contagem de eventos
      try {
        const { count, error: countError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true });

        if (countError) {
          console.error('Erro ao contar eventos:', countError);
        } else {
          console.log(`Total de eventos no banco de dados: ${count || 0}`);
          setEventsCount(count || 0);
        }
      } catch (e) {
        console.error('Erro ao contar eventos:', e);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      setConnectionStatus({
        connected: false,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Status da Conexão Supabase
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Card className="mt-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Status da Conexão Supabase</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={checkConnection}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Atualizar
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              Informações detalhadas sobre a conexão com o Supabase e os eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Verificando conexão...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status de Autenticação */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Status de Autenticação</h3>
                  {isAuthenticated === null ? (
                    <Badge variant="outline" className="bg-gray-100">Desconhecido</Badge>
                  ) : isAuthenticated ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800">Autenticado</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Não Autenticado</Badge>
                  )}
                </div>

                {/* Status de Conexão */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Status de Conexão</h3>
                  {connectionStatus === null ? (
                    <Badge variant="outline" className="bg-gray-100">Desconhecido</Badge>
                  ) : connectionStatus.connected ? (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertTitle>Conectado ao Supabase</AlertTitle>
                      <AlertDescription>
                        A conexão com o Supabase está funcionando corretamente.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro de Conexão</AlertTitle>
                      <AlertDescription>
                        {connectionStatus.error || 'Não foi possível conectar ao Supabase.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Contagem de Eventos */}
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-2">Eventos no Banco de Dados</h3>
                  {eventsCount === null ? (
                    <Badge variant="outline" className="bg-gray-100">Desconhecido</Badge>
                  ) : eventsCount > 0 ? (
                    <div>
                      <Badge variant="outline" className="bg-green-100 text-green-800">{eventsCount} eventos encontrados</Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        Existem eventos cadastrados no banco de dados.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Nenhum evento encontrado</Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        Não há eventos cadastrados no banco de dados. Utilize o botão "Criar eventos de teste" na página inicial.
                      </p>
                    </div>
                  )}
                </div>

                {/* Detalhes Adicionais */}
                {connectionStatus && connectionStatus.details && (
                  <div className="border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">Detalhes do Erro</h3>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {connectionStatus.details}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 