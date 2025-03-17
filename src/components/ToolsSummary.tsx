import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Database, 
  ShieldAlert, 
  Table, 
  Code,
  Key,
  AlertCircle,
  FileText,
  Info,
  Download,
  Shield
} from 'lucide-react';

export function ToolsSummary() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Wrench className="h-4 w-4 mr-2" />
        Ferramentas Disponíveis
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Ferramentas Disponíveis</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Como usar as ferramentas</h4>
              <p className="text-xs text-blue-700 mt-1">
                Esta página contém várias ferramentas para ajudar na configuração e solução de problemas com o Supabase.
                Abaixo está um resumo de cada ferramenta disponível.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guia de Solução de Problemas */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Guia de Solução de Problemas</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Contém soluções para problemas comuns encontrados ao configurar e usar o Supabase.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão no canto superior esquerdo
                </p>
              </div>
            </div>
          </div>
          
          {/* Table Check */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Table className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Table Check</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Verifica se as tabelas necessárias existem no Supabase.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* Table Structure Check */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Table Structure Check</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Verifica a estrutura das tabelas no Supabase, mostrando as colunas e seus tipos.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* Policy Check */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Policy Check</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Verifica as políticas de acesso configuradas para as tabelas no Supabase, essenciais para permitir acesso público aos eventos.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* SQL Function Viewer */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Code className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">SQL Function Viewer</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe o script SQL para criar a função get_table_columns, necessária para o Table Structure Check.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* SQL Tables Viewer */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">SQL Tables Viewer</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe o script SQL para criar as tabelas necessárias para o funcionamento da aplicação.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* SQL Policies Viewer */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">SQL Policies Viewer</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe o script SQL para configurar as políticas de acesso no Supabase, permitindo acesso público aos eventos.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* RPC Function Info */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">RPC Function Info</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe o script SQL para criar a função RPC que verifica as políticas de acesso no Supabase.
                  <span className="text-red-600 font-medium"> Importante: </span>
                  Necessário para resolver o erro 404 "Could not find the function get_policies_info".
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* UUID Extension Info */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Key className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">UUID Extension Info</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe informações sobre a extensão uuid-ossp e como habilitá-la no Supabase.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão no canto superior direito
                </p>
              </div>
            </div>
          </div>
          
          {/* Supabase Error Details */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Supabase Error Details</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe detalhes sobre erros encontrados ao se conectar ao Supabase e permite verificar a conexão.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* Supabase Connection Status */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Database className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Status da Conexão Supabase</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe informações detalhadas sobre o status da conexão com o Supabase, autenticação e contagem de eventos.
                  <span className="text-blue-600 font-medium"> Útil para diagnóstico: </span>
                  Verifica se há eventos no banco de dados e se a conexão está funcionando.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* SQL Syntax Fix */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Code className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">SQL Syntax Fix</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe informações sobre correções de sintaxe SQL para políticas de segurança.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão flutuante na interface
                </p>
              </div>
            </div>
          </div>
          
          {/* Supabase Logs */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Logs do Supabase</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe informações sobre como acessar e interpretar os logs do Supabase para solucionar problemas.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão no canto inferior direito
                </p>
              </div>
            </div>
          </div>
          
          {/* Project Info */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Sobre o Projeto</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe informações detalhadas sobre o projeto, incluindo tecnologias utilizadas, estrutura do banco de dados e funcionalidades.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão no canto superior direito
                </p>
              </div>
            </div>
          </div>
          
          {/* Installation Guide */}
          <div className="border border-gray-200 rounded-md p-3 bg-white">
            <div className="flex items-start gap-2">
              <Download className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Guia de Instalação</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Exibe um guia passo a passo para instalar e configurar o projeto, desde o clone do repositório até a execução da aplicação.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Localização:</strong> Botão no canto inferior esquerdo
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Dica</h4>
              <p className="text-xs text-yellow-700 mt-1">
                Recomendamos seguir esta ordem para configurar o Supabase:
              </p>
              <ol className="text-xs text-yellow-700 mt-2 list-decimal pl-4 space-y-1">
                <li>Configure o arquivo .env com as credenciais corretas do Supabase</li>
                <li>Habilite a extensão uuid-ossp no Supabase</li>
                <li>Execute o script SQL para criar as tabelas</li>
                <li>Execute o script SQL para criar a função get_table_columns</li>
                <li>Use o Table Check e o Table Structure Check para verificar se tudo está configurado corretamente</li>
                <li>Se encontrar problemas, consulte o Guia de Solução de Problemas</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 