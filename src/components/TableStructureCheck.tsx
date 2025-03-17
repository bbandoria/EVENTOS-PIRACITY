import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabase';
import { Database, Table } from 'lucide-react';

interface TableColumn {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

interface TableInfo {
  name: string;
  exists: boolean;
  columns: TableColumn[];
  error?: string;
}

export function TableStructureCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState<TableInfo[]>([]);

  const checkTableStructure = async () => {
    setLoading(true);
    try {
      const tablesToCheck = ['venues', 'events', 'favorites'];
      const tablesInfo: TableInfo[] = [];

      for (const tableName of tablesToCheck) {
        try {
          console.log(`Verificando estrutura da tabela ${tableName}...`);
          
          // Verificar se a tabela existe
          const { data: existsData, error: existsError } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);
            
          if (existsError) {
            console.error(`Erro ao verificar tabela ${tableName}:`, existsError);
            tablesInfo.push({
              name: tableName,
              exists: false,
              columns: [],
              error: existsError.message
            });
            continue;
          }
          
          // Obter informações sobre as colunas da tabela
          const { data: columnsData, error: columnsError } = await supabase
            .rpc('get_table_columns', { table_name: tableName });
            
          if (columnsError) {
            console.error(`Erro ao obter colunas da tabela ${tableName}:`, columnsError);
            tablesInfo.push({
              name: tableName,
              exists: true,
              columns: [],
              error: columnsError.message
            });
            continue;
          }
          
          tablesInfo.push({
            name: tableName,
            exists: true,
            columns: columnsData || []
          });
          
        } catch (error) {
          console.error(`Erro ao verificar tabela ${tableName}:`, error);
          tablesInfo.push({
            name: tableName,
            exists: false,
            columns: [],
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
      
      setTables(tablesInfo);
    } catch (error) {
      console.error('Erro ao verificar estrutura das tabelas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-84 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Database className="h-4 w-4 mr-2" />
        Verificar Estrutura das Tabelas
      </Button>
    );
  }

  return (
    <div className="fixed bottom-84 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Estrutura das Tabelas</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkTableStructure}
            disabled={loading}
          >
            <Table className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Verificando...' : 'Verificar Estrutura'}
          </Button>
        </div>
        
        {tables.length > 0 && (
          <div className="space-y-4">
            {tables.map((table) => (
              <div 
                key={table.name} 
                className={`p-3 rounded-md ${table.exists ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <h4 className={`text-sm font-medium ${table.exists ? 'text-green-800' : 'text-red-800'}`}>
                  Tabela: {table.name} {table.exists ? '(Existe)' : '(Não existe)'}
                </h4>
                
                {table.error && (
                  <p className="text-xs text-red-600 mt-1">
                    Erro: {table.error}
                  </p>
                )}
                
                {table.columns.length > 0 ? (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium mb-1">Colunas:</h5>
                    <div className="bg-white rounded border border-gray-200 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nullable</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {table.columns.map((column, index) => (
                            <tr key={index}>
                              <td className="px-2 py-1 whitespace-nowrap">{column.column_name}</td>
                              <td className="px-2 py-1 whitespace-nowrap">{column.data_type}</td>
                              <td className="px-2 py-1 whitespace-nowrap">{column.is_nullable}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : table.exists && (
                  <p className="text-xs text-gray-600 mt-1">
                    Não foi possível obter informações sobre as colunas.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Dica</h4>
              <p className="text-xs text-blue-700 mt-1">
                Se as tabelas não existirem ou tiverem uma estrutura incorreta, execute o script SQL fornecido no painel do Supabase.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Você também pode precisar criar uma função RPC chamada 'get_table_columns' para obter informações detalhadas sobre as colunas.
              </p>
              <pre className="mt-2 text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql;`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 