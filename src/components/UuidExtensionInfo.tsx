import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Database, Check } from 'lucide-react';

export function UuidExtensionInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Habilitar a extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

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
        className="fixed top-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Database className="h-4 w-4 mr-2" />
        UUID Extension
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Extensão UUID-OSSP</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">O que é a extensão uuid-ossp?</h4>
              <p className="text-xs text-blue-700 mt-1">
                A extensão uuid-ossp fornece funções para gerar identificadores únicos universais (UUIDs) usando algoritmos padrão.
                Esta extensão é necessária para que a função uuid_generate_v4() funcione corretamente nas tabelas do projeto.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Instruções</h4>
              <p className="text-xs text-blue-700 mt-1">
                Execute este script SQL no painel do Supabase para habilitar a extensão uuid-ossp.
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
                Esta extensão deve ser habilitada <strong>antes</strong> de executar o script para criar as tabelas.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Se você já criou as tabelas sem habilitar esta extensão, pode ser necessário recriar as tabelas após habilitar a extensão.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Verificação</h4>
              <p className="text-xs text-green-700 mt-1">
                Para verificar se a extensão está habilitada, você pode executar o seguinte comando SQL:
              </p>
              <pre className="bg-green-100 text-green-800 p-2 rounded-md text-xs mt-2 overflow-x-auto">
                SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
              </pre>
              <p className="text-xs text-green-700 mt-2">
                Se o resultado mostrar uma linha, a extensão está habilitada. Caso contrário, você precisa habilitá-la.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 