import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  ExternalLink, 
  Database, 
  Search, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

export function SupabaseLogs() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <FileText className="h-4 w-4 mr-2" />
        Logs do Supabase
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Como Verificar os Logs do Supabase</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Por que verificar os logs?</h4>
              <p className="text-xs text-blue-700 mt-1">
                Os logs do Supabase podem fornecer informações detalhadas sobre erros e operações realizadas no banco de dados.
                Verificar os logs é uma etapa importante para solucionar problemas com o Supabase.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Passos para acessar os logs do Supabase:</h4>
          
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">1</div>
              <div>
                <h5 className="text-sm font-medium">Acesse o painel do Supabase</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Faça login no <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                    Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                  </a> e selecione o seu projeto.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">2</div>
              <div>
                <h5 className="text-sm font-medium">Navegue até a seção de logs</h5>
                <p className="text-xs text-gray-600 mt-1">
                  No menu lateral, clique em "Database" e depois em "Logs".
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="text-xs text-gray-500 flex items-center">
                    <Database className="h-3 w-3 mr-1" /> Database
                  </div>
                  <div className="text-xs text-gray-500">→</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <FileText className="h-3 w-3 mr-1" /> Logs
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">3</div>
              <div>
                <h5 className="text-sm font-medium">Selecione o tipo de log</h5>
                <p className="text-xs text-gray-600 mt-1">
                  O Supabase oferece diferentes tipos de logs:
                </p>
                <ul className="text-xs text-gray-600 mt-2 space-y-1 pl-4 list-disc">
                  <li><strong>PostgreSQL:</strong> Logs do banco de dados PostgreSQL</li>
                  <li><strong>Auth:</strong> Logs relacionados à autenticação</li>
                  <li><strong>API:</strong> Logs das requisições à API do Supabase</li>
                  <li><strong>Storage:</strong> Logs relacionados ao armazenamento de arquivos</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">4</div>
              <div>
                <h5 className="text-sm font-medium">Filtre os logs</h5>
                <p className="text-xs text-gray-600 mt-1">
                  Use os filtros disponíveis para encontrar logs específicos:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Search className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Pesquisa por texto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Nível de severidade</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Intervalo de tempo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Dicas para análise de logs</h4>
              <ul className="text-xs text-yellow-700 mt-2 space-y-1 pl-4 list-disc">
                <li>Procure por mensagens de erro com termos como "ERROR", "FATAL" ou "EXCEPTION"</li>
                <li>Verifique os logs próximos ao horário em que o problema ocorreu</li>
                <li>Preste atenção a erros relacionados às tabelas que você está utilizando</li>
                <li>Procure por erros de sintaxe SQL ou violações de restrições</li>
                <li>Se estiver tendo problemas com políticas RLS, procure por mensagens relacionadas a permissões</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Logs comuns e seus significados</h4>
              <div className="mt-2 space-y-2">
                <div className="text-xs">
                  <p className="font-mono bg-red-50 text-red-700 p-1 rounded">ERROR: relation "venues" does not exist</p>
                  <p className="text-green-700 mt-1">Significa que a tabela "venues" não existe. Execute o script SQL para criar as tabelas.</p>
                </div>
                
                <div className="text-xs">
                  <p className="font-mono bg-red-50 text-red-700 p-1 rounded">ERROR: permission denied for table venues</p>
                  <p className="text-green-700 mt-1">Problema com as políticas RLS. Verifique se as políticas estão configuradas corretamente.</p>
                </div>
                
                <div className="text-xs">
                  <p className="font-mono bg-red-50 text-red-700 p-1 rounded">ERROR: function uuid_generate_v4() does not exist</p>
                  <p className="text-green-700 mt-1">A extensão uuid-ossp não está habilitada. Execute o script para habilitá-la.</p>
                </div>
                
                <div className="text-xs">
                  <p className="font-mono bg-red-50 text-red-700 p-1 rounded">ERROR: null value in column "name" violates not-null constraint</p>
                  <p className="text-green-700 mt-1">Tentativa de inserir um valor nulo em uma coluna que não permite valores nulos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 