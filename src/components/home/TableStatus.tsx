import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { AlertTriangle, CheckCircle2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TableStatus() {
  const [tablesExist, setTablesExist] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    checkTables();
  }, []);

  const checkTables = async () => {
    try {
      setLoading(true);
      
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
      
      const allTablesExist = !venuesError && !eventsError && !favoritesError;
      setTablesExist(allTablesExist);
    } catch (error) {
      console.error('Erro ao verificar tabelas:', error);
      setTablesExist(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading || tablesExist === null || !isVisible) {
    return null;
  }

  if (tablesExist) {
    return null; // Não mostrar nada se as tabelas existirem
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="font-medium text-amber-800">Configuração do Supabase incompleta</h3>
          <p className="text-sm text-amber-700 mt-1">
            As tabelas necessárias não foram encontradas no seu banco de dados Supabase.
            Isso pode causar problemas ao carregar eventos.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
              asChild
            >
              <Link to="/test">
                <Database className="h-4 w-4 mr-1.5" />
                Ir para página de diagnóstico
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:bg-amber-100 hover:text-amber-800"
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