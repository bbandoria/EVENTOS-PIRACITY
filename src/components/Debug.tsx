import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';
import { useAuthContext } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { checkSupabaseConnection } from '@/utils/checkSupabase';

export function Debug() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) {
        console.error('Erro ao verificar eventos:', error);
        toast.error('Erro ao verificar eventos');
        return;
      }
      
      setDebugInfo({
        events: data,
        eventsCount: data?.length || 0,
        user: user ? { id: user.id, email: user.email } : 'não logado',
        timestamp: new Date().toISOString()
      });
      
      toast.success(`Encontrados ${data?.length || 0} eventos`);
    } catch (error) {
      console.error('Erro ao verificar eventos:', error);
      toast.error('Erro ao verificar eventos');
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      setLoading(true);
      const result = await checkSupabaseConnection();
      
      setDebugInfo({
        connection: result,
        user: user ? { id: user.id, email: user.email } : 'não logado',
        timestamp: new Date().toISOString()
      });
      
      if (result.connected) {
        toast.success('Conexão com o Supabase verificada com sucesso');
      } else {
        toast.error(`Erro na conexão: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      toast.error('Erro ao verificar conexão');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium">Usuário:</p>
          <p className="text-xs text-muted-foreground">
            {user ? user.email : 'Não logado'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={checkEvents}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Eventos'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={checkConnection}
            disabled={loading}
          >
            {loading ? 'Verificando...' : 'Verificar Conexão'}
          </Button>
        </div>
        
        {debugInfo && (
          <div className="mt-4 space-y-2">
            {debugInfo.eventsCount !== undefined && (
              <p className="text-sm font-medium">Eventos: {debugInfo.eventsCount}</p>
            )}
            {debugInfo.connection && (
              <p className="text-sm font-medium">
                Conexão: {debugInfo.connection.connected ? 'OK' : 'Erro'}
              </p>
            )}
            <div className="max-h-40 overflow-y-auto text-xs bg-muted p-2 rounded">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 