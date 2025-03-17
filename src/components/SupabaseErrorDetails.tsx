import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bug, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { checkSupabaseConnection } from '@/utils/checkSupabase';
import { toast } from 'sonner';

interface ErrorLog {
  timestamp: string;
  message: string;
  details?: any;
  endpoint?: string;
  status?: number;
}

export function SupabaseErrorDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // Interceptar erros de requisição do Supabase
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      
      if (url.includes('supabase.co')) {
        try {
          const response = await originalFetch(input, init);
          
          if (!response.ok && (response.status === 401 || response.status === 403)) {
            const errorLog: ErrorLog = {
              timestamp: new Date().toISOString(),
              message: `Erro ${response.status}: ${response.statusText}`,
              endpoint: url,
              status: response.status
            };
            
            setErrorLogs(prev => [errorLog, ...prev].slice(0, 10));
          }
          
          return response;
        } catch (error) {
          const errorLog: ErrorLog = {
            timestamp: new Date().toISOString(),
            message: error instanceof Error ? error.message : 'Erro desconhecido',
            details: error
          };
          
          setErrorLogs(prev => [errorLog, ...prev].slice(0, 10));
          throw error;
        }
      }
      
      return originalFetch(input, init);
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const result = await checkSupabaseConnection();
      setConnectionStatus(result);
      
      if (result.connected) {
        toast.success('Conexão com o Supabase verificada com sucesso');
      } else {
        const errorLog: ErrorLog = {
          timestamp: new Date().toISOString(),
          message: `Erro de conexão: ${result.message}`,
          details: result.error
        };
        
        setErrorLogs(prev => [errorLog, ...prev].slice(0, 10));
        toast.error(`Erro na conexão: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      
      const errorLog: ErrorLog = {
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: error
      };
      
      setErrorLogs(prev => [errorLog, ...prev].slice(0, 10));
      toast.error('Erro ao verificar conexão');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setErrorLogs([]);
    toast.success('Logs de erro limpos');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`fixed bottom-68 left-4 z-50 ${errorLogs.length > 0 ? 'bg-red-100 border-red-300 text-red-800' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4 mr-2" />
        Erros Supabase {errorLogs.length > 0 && `(${errorLogs.length})`}
      </Button>
    );
  }

  return (
    <div className="fixed bottom-68 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Detalhes de Erros do Supabase</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkConnection}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Verificando...' : 'Verificar Conexão'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearLogs}
            disabled={errorLogs.length === 0}
          >
            Limpar Logs
          </Button>
        </div>
        
        {connectionStatus && (
          <div className={`p-3 rounded-md ${connectionStatus.connected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-5 w-5 ${connectionStatus.connected ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <h4 className={`text-sm font-medium ${connectionStatus.connected ? 'text-green-800' : 'text-red-800'}`}>
                  Status da Conexão: {connectionStatus.connected ? 'OK' : 'Erro'}
                </h4>
                <p className="text-sm mt-1">{connectionStatus.message}</p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Logs de Erro ({errorLogs.length})</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              disabled={errorLogs.length === 0}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Menos Detalhes
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Mais Detalhes
                </>
              )}
            </Button>
          </div>
          
          {errorLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum erro registrado.</p>
          ) : (
            <div className="space-y-2">
              {errorLogs.map((log, index) => (
                <div 
                  key={index} 
                  className="bg-red-50 border border-red-200 rounded-md p-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">{log.message}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                      {log.endpoint && (
                        <p className="text-xs text-red-600 mt-1">
                          Endpoint: {log.endpoint}
                        </p>
                      )}
                      {showDetails && log.details && (
                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                    {log.status && (
                      <span className="text-xs font-medium bg-red-200 text-red-800 px-2 py-1 rounded">
                        {log.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Dicas para resolver erros 401</h4>
              <ol className="text-xs text-blue-700 mt-2 list-decimal pl-4 space-y-1">
                <li>Verifique se a chave anônima do Supabase está correta e não expirou</li>
                <li>Certifique-se de que as tabelas necessárias existem no Supabase</li>
                <li>Verifique se as políticas de segurança estão configuradas corretamente</li>
                <li>Tente limpar o cache do navegador e recarregar a página</li>
                <li>Verifique se o projeto Supabase está ativo e não em modo de manutenção</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 