import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import { AlertCircle, Code } from 'lucide-react';

export function TableCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkTables = async () => {
    try {
      setLoading(true);
      setTableInfo(null);
      
      console.log('Verificando tabelas do Supabase...');
      
      // Verificar tabela venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('id')
        .limit(1);
      
      // Verificar tabela events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .limit(1);
      
      // Verificar tabela favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('id')
        .limit(1);
      
      const info = {
        venues: {
          exists: !venuesError,
          error: venuesError ? venuesError.message : null,
          data: venuesData
        },
        events: {
          exists: !eventsError,
          error: eventsError ? eventsError.message : null,
          data: eventsData
        },
        favorites: {
          exists: !favoritesError,
          error: favoritesError ? favoritesError.message : null,
          data: favoritesData
        },
        timestamp: new Date().toISOString()
      };
      
      setTableInfo(info);
      
      if (!info.venues.exists || !info.events.exists || !info.favorites.exists) {
        toast.error('Algumas tabelas não existem no Supabase');
      } else {
        toast.success('Todas as tabelas existem no Supabase');
      }
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
      toast.error('Erro ao verificar tabelas');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-20 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        Table Check
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Verificação de Tabelas</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={checkTables}
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Verificar Tabelas'}
        </Button>
        
        {tableInfo && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Tabela venues:</p>
              <p className={`text-sm ${tableInfo.venues.exists ? 'text-green-600' : 'text-red-600'}`}>
                {tableInfo.venues.exists ? 'Existe' : 'Não existe'}
              </p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm font-medium">Tabela events:</p>
              <p className={`text-sm ${tableInfo.events.exists ? 'text-green-600' : 'text-red-600'}`}>
                {tableInfo.events.exists ? 'Existe' : 'Não existe'}
              </p>
            </div>
            
            <div className="flex justify-between">
              <p className="text-sm font-medium">Tabela favorites:</p>
              <p className={`text-sm ${tableInfo.favorites.exists ? 'text-green-600' : 'text-red-600'}`}>
                {tableInfo.favorites.exists ? 'Existe' : 'Não existe'}
              </p>
            </div>
            
            {(!tableInfo.venues.exists || !tableInfo.events.exists || !tableInfo.favorites.exists) && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Tabelas ausentes detectadas</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Para criar as tabelas necessárias, execute o script SQL disponível no botão <code className="bg-amber-100 px-1 rounded">SQL Script</code> no canto inferior da tela.
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      <strong>Nota:</strong> O script foi atualizado para corrigir um erro de sintaxe nas políticas SQL.
                    </p>
                    <ol className="text-xs text-amber-700 mt-2 list-decimal pl-4 space-y-1">
                      <li>Clique no botão <span className="inline-flex items-center"><Code className="h-3 w-3 mr-1" />SQL Script</span></li>
                      <li>Copie o script SQL</li>
                      <li>Acesse o painel do Supabase</li>
                      <li>Navegue até "SQL Editor"</li>
                      <li>Crie uma nova query</li>
                      <li>Cole o script SQL</li>
                      <li>Execute a query</li>
                      <li>Volte aqui e clique em "Verificar Tabelas" novamente</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
            
            <div className="max-h-40 overflow-y-auto text-xs bg-muted p-2 rounded">
              <pre>{JSON.stringify(tableInfo, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 