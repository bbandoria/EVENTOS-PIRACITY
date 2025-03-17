import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function EnvDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const [envInfo, setEnvInfo] = useState<any>(null);

  const checkEnv = () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const info = {
        VITE_SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : 'não definido',
        VITE_SUPABASE_ANON_KEY: supabaseKey ? `${supabaseKey.substring(0, 10)}...` : 'não definido',
        urlDefined: !!supabaseUrl,
        keyDefined: !!supabaseKey,
        timestamp: new Date().toISOString()
      };
      
      setEnvInfo(info);
      
      if (!supabaseUrl || !supabaseKey) {
        toast.error('Variáveis de ambiente do Supabase não estão configuradas corretamente');
      } else {
        toast.success('Variáveis de ambiente do Supabase verificadas');
      }
    } catch (error) {
      console.error('Erro ao verificar variáveis de ambiente:', error);
      toast.error('Erro ao verificar variáveis de ambiente');
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        Env Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Variáveis de Ambiente</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={checkEnv}
        >
          Verificar Variáveis
        </Button>
        
        {envInfo && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">SUPABASE_URL:</p>
              <p className={`text-sm ${envInfo.urlDefined ? 'text-green-600' : 'text-red-600'}`}>
                {envInfo.urlDefined ? 'Definido' : 'Não definido'}
              </p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm font-medium">SUPABASE_KEY:</p>
              <p className={`text-sm ${envInfo.keyDefined ? 'text-green-600' : 'text-red-600'}`}>
                {envInfo.keyDefined ? 'Definido' : 'Não definido'}
              </p>
            </div>
            
            <div className="max-h-40 overflow-y-auto text-xs bg-muted p-2 rounded">
              <pre>{JSON.stringify(envInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 