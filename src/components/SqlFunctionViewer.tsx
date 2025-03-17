import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Database, Check } from 'lucide-react';

export function SqlFunctionViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Função para obter informações sobre as colunas de uma tabela
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
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
$$ LANGUAGE plpgsql;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-100 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Database className="h-4 w-4 mr-2" />
        SQL Function
      </Button>
    );
  }

  return (
    <div className="fixed bottom-100 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Função SQL para Verificar Estrutura das Tabelas</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Instruções</h4>
              <p className="text-xs text-blue-700 mt-1">
                Execute este script SQL no painel do Supabase para criar uma função que permite verificar a estrutura das tabelas.
              </p>
              <ol className="text-xs text-blue-700 mt-2 list-decimal pl-4 space-y-1">
                <li>Acesse o painel do Supabase</li>
                <li>Vá para a seção "SQL Editor"</li>
                <li>Clique em "New Query"</li>
                <li>Cole o script abaixo</li>
                <li>Clique em "Run" para executar o script</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
            {sqlScript}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copiar
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Nota</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Esta função é necessária para que o componente TableStructureCheck possa exibir informações detalhadas sobre as colunas das tabelas.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Se você não executar este script, o componente ainda funcionará, mas não poderá exibir informações sobre as colunas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 