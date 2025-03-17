import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Key, 
  Database, 
  ShieldAlert, 
  Wifi, 
  Table, 
  Code
} from 'lucide-react';

export function TroubleshootingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <HelpCircle className="h-4 w-4 mr-2" />
        Guia de Solução de Problemas
      </Button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Guia de Solução de Problemas</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Como usar este guia</h4>
              <p className="text-xs text-blue-700 mt-1">
                Este guia contém soluções para problemas comuns encontrados ao configurar e usar o Supabase com esta aplicação.
                Clique em cada seção para expandir e ver as soluções detalhadas.
              </p>
            </div>
          </div>
        </div>
        
        {/* Erro 401 (Unauthorized) */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('401')}
          >
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-red-500" />
              <span className="font-medium text-sm">Erro 401 (Unauthorized)</span>
            </div>
            {expandedSection === '401' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === '401' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                O erro 401 (Unauthorized) ocorre quando a chave de API do Supabase está incorreta ou expirou.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique o arquivo .env:</strong> Certifique-se de que o arquivo .env contém as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY com os valores corretos.
                  </li>
                  <li>
                    <strong>Obtenha novas credenciais:</strong> Acesse o painel do Supabase, vá para Project Settings &gt; API e copie a URL e a anon key.
                  </li>
                  <li>
                    <strong>Reinicie o servidor:</strong> Após atualizar o arquivo .env, reinicie o servidor de desenvolvimento.
                  </li>
                  <li>
                    <strong>Verifique as políticas RLS:</strong> Certifique-se de que as políticas de Row Level Security estão configuradas corretamente para permitir acesso anônimo às tabelas necessárias.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Erro 400 (Bad Request) */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('400')}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-sm">Erro 400 (Bad Request)</span>
            </div>
            {expandedSection === '400' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === '400' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                O erro 400 (Bad Request) ocorre quando a requisição enviada ao Supabase contém erros ou está mal formatada.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique a estrutura das tabelas:</strong> Certifique-se de que as tabelas no Supabase têm a estrutura correta, com todas as colunas necessárias.
                  </li>
                  <li>
                    <strong>Verifique as consultas:</strong> Certifique-se de que as consultas SQL estão corretas e compatíveis com a estrutura das tabelas.
                  </li>
                  <li>
                    <strong>Verifique os dados enviados:</strong> Certifique-se de que os dados enviados nas requisições estão no formato correto e contêm todos os campos obrigatórios.
                  </li>
                  <li>
                    <strong>Consulte os logs:</strong> Verifique os logs do console para obter mais detalhes sobre o erro.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Tabelas não existem */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('tables')}
          >
            <div className="flex items-center gap-2">
              <Table className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-sm">Tabelas não existem</span>
            </div>
            {expandedSection === 'tables' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'tables' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                Se as tabelas necessárias não existirem no Supabase, a aplicação não funcionará corretamente.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Execute o script SQL:</strong> Use o componente "SQL Tables" para copiar o script SQL e executá-lo no painel do Supabase.
                  </li>
                  <li>
                    <strong>Habilite a extensão uuid-ossp:</strong> Certifique-se de habilitar a extensão uuid-ossp antes de criar as tabelas.
                  </li>
                  <li>
                    <strong>Verifique a estrutura das tabelas:</strong> Use o componente "Table Structure Check" para verificar se as tabelas foram criadas corretamente.
                  </li>
                  <li>
                    <strong>Verifique as políticas RLS:</strong> Certifique-se de que as políticas de Row Level Security estão configuradas corretamente.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Problemas com RLS (Row Level Security) */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('rls')}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-sm">Problemas com RLS (Row Level Security)</span>
            </div>
            {expandedSection === 'rls' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'rls' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                Problemas com as políticas de Row Level Security podem impedir o acesso aos dados ou a inserção de novos registros.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique se o RLS está habilitado:</strong> Certifique-se de que o RLS está habilitado para todas as tabelas.
                  </li>
                  <li>
                    <strong>Verifique as políticas:</strong> Certifique-se de que as políticas de RLS estão configuradas corretamente para permitir as operações necessárias.
                  </li>
                  <li>
                    <strong>Políticas para SELECT:</strong> Certifique-se de que existem políticas que permitem a leitura dos dados.
                  </li>
                  <li>
                    <strong>Políticas para INSERT:</strong> Certifique-se de que existem políticas que permitem a inserção de novos registros.
                  </li>
                  <li>
                    <strong>Execute o script SQL novamente:</strong> Se necessário, execute o script SQL novamente para recriar as políticas.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Problemas de conexão */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('connection')}
          >
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-500" />
              <span className="font-medium text-sm">Problemas de conexão</span>
            </div>
            {expandedSection === 'connection' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'connection' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                Problemas de conexão podem ocorrer devido a problemas de rede, configurações incorretas ou problemas no servidor do Supabase.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique sua conexão com a internet:</strong> Certifique-se de que você está conectado à internet.
                  </li>
                  <li>
                    <strong>Verifique o status do Supabase:</strong> Verifique se o serviço do Supabase está online.
                  </li>
                  <li>
                    <strong>Verifique as credenciais:</strong> Certifique-se de que a URL e a chave anônima do Supabase estão corretas.
                  </li>
                  <li>
                    <strong>Verifique o CORS:</strong> Se estiver desenvolvendo localmente, certifique-se de que o CORS está configurado corretamente no Supabase.
                  </li>
                  <li>
                    <strong>Use o componente de verificação de conexão:</strong> Use o componente "Supabase Error Details" para verificar a conexão com o Supabase.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Erros na criação de eventos */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('events')}
          >
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-indigo-500" />
              <span className="font-medium text-sm">Erros na criação de eventos</span>
            </div>
            {expandedSection === 'events' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'events' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                Erros na criação de eventos podem ocorrer devido a problemas na estrutura das tabelas, políticas de RLS ou dados inválidos.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique a estrutura das tabelas:</strong> Certifique-se de que as tabelas venues e events têm a estrutura correta.
                  </li>
                  <li>
                    <strong>Verifique as políticas de RLS:</strong> Certifique-se de que as políticas de RLS permitem a inserção de novos registros.
                  </li>
                  <li>
                    <strong>Verifique a extensão uuid-ossp:</strong> Certifique-se de que a extensão uuid-ossp está habilitada.
                  </li>
                  <li>
                    <strong>Verifique os dados enviados:</strong> Certifique-se de que os dados enviados estão no formato correto e contêm todos os campos obrigatórios.
                  </li>
                  <li>
                    <strong>Consulte os logs:</strong> Verifique os logs do console para obter mais detalhes sobre o erro.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
        
        {/* Problemas com o banco de dados */}
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection('database')}
          >
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-sm">Problemas com o banco de dados</span>
            </div>
            {expandedSection === 'database' ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {expandedSection === 'database' && (
            <div className="p-3 bg-white space-y-3">
              <p className="text-xs text-gray-700">
                Problemas com o banco de dados podem ocorrer devido a erros na estrutura das tabelas, restrições ou triggers.
              </p>
              
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-800">Soluções:</h5>
                <ol className="text-xs text-gray-700 list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Verifique a estrutura das tabelas:</strong> Use o componente "Table Structure Check" para verificar se as tabelas têm a estrutura correta.
                  </li>
                  <li>
                    <strong>Verifique as restrições:</strong> Certifique-se de que não há restrições que impeçam a inserção de novos registros.
                  </li>
                  <li>
                    <strong>Verifique os triggers:</strong> Certifique-se de que não há triggers que estejam causando erros.
                  </li>
                  <li>
                    <strong>Recrie as tabelas:</strong> Se necessário, recrie as tabelas usando o script SQL fornecido.
                  </li>
                  <li>
                    <strong>Verifique os logs do Supabase:</strong> Acesse o painel do Supabase e verifique os logs para obter mais detalhes sobre os erros.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 