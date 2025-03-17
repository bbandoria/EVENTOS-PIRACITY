import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkSupabaseConnection } from '@/utils/checkSupabase';

export function ConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const result = await checkSupabaseConnection();
      setConnectionStatus(result);
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      setConnectionStatus({
        connected: false,
        message: String(error),
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || connectionStatus === null || !isVisible) {
    return null;
  }

  if (connectionStatus.connected) {
    return null; // Não mostrar nada se a conexão estiver OK
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
      <div className="flex items-start gap-3">
        <WifiOff className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="font-medium text-red-800">Problema de conexão com o Supabase</h3>
          <p className="text-sm text-red-700 mt-1">
            Não foi possível conectar ao banco de dados Supabase. 
            Isso pode impedir o carregamento de eventos.
          </p>
          <p className="text-xs text-red-600 mt-1">
            Erro: {connectionStatus.message}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-red-100 border-red-200 text-red-800 hover:bg-red-200 hover:text-red-900"
              asChild
            >
              <Link to="/test">
                <Wifi className="h-4 w-4 mr-1.5" />
                Verificar conexão
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-700 hover:bg-red-100 hover:text-red-800"
              onClick={() => setIsVisible(false)}
            >
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 