import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Terminal, 
  FileCode, 
  Play, 
  Database, 
  Settings, 
  CheckCircle
} from 'lucide-react';

export function InstallationGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
        <Download className="h-4 w-4 mr-2" />
        Guia de Instalação
      </Button>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Guia de Instalação</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Passo {currentStep} de {totalSteps}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextStep}
              disabled={currentStep === totalSteps}
            >
              Próximo
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
          <div 
            className="absolute left-0 top-0 w-1 bg-blue-500 transition-all duration-300"
            style={{ height: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
          
          {/* Passo 1: Clone o repositório */}
          {currentStep === 1 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">1</span>
              </div>
              <h4 className="text-sm font-medium">Clone o repositório</h4>
              <p className="text-xs text-gray-600 mt-1">
                Primeiro, clone o repositório do GitHub para o seu computador.
              </p>
              <div className="mt-3 bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>git clone https://github.com/seu-usuario/eventos-pira-hub.git</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>cd eventos-pira-hub</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Passo 2: Instale as dependências */}
          {currentStep === 2 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">2</span>
              </div>
              <h4 className="text-sm font-medium">Instale as dependências</h4>
              <p className="text-xs text-gray-600 mt-1">
                Instale todas as dependências necessárias para o projeto.
              </p>
              <div className="mt-3 bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>npm install</span>
                </div>
                <div className="mt-2 text-gray-400">
                  # ou, se você preferir usar yarn
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>yarn install</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Passo 3: Configure o Supabase */}
          {currentStep === 3 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">3</span>
              </div>
              <h4 className="text-sm font-medium">Configure o Supabase</h4>
              <p className="text-xs text-gray-600 mt-1">
                Crie um projeto no Supabase e obtenha as credenciais necessárias.
              </p>
              <ol className="mt-3 space-y-2 text-xs text-gray-600 list-decimal pl-4">
                <li>Acesse <a href="https://app.supabase.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">app.supabase.io</a> e faça login</li>
                <li>Clique em "New Project"</li>
                <li>Preencha os detalhes do projeto e clique em "Create new project"</li>
                <li>Após a criação, vá para "Settings" {'>'}  "API" para obter a URL e a chave anônima</li>
              </ol>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-700">
                <div className="flex items-start gap-2">
                  <Database className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    Guarde a URL e a chave anônima do Supabase, pois você precisará delas no próximo passo.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Passo 4: Configure as variáveis de ambiente */}
          {currentStep === 4 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">4</span>
              </div>
              <h4 className="text-sm font-medium">Configure as variáveis de ambiente</h4>
              <p className="text-xs text-gray-600 mt-1">
                Crie um arquivo .env na raiz do projeto com as credenciais do Supabase.
              </p>
              <div className="mt-3 bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  <span>.env</span>
                </div>
                <div className="mt-2">
                  VITE_SUPABASE_URL=sua_url_do_supabase<br />
                  VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase<br />
                  NODE_ENV=development
                </div>
              </div>
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs text-yellow-700">
                <div className="flex items-start gap-2">
                  <Settings className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    Substitua "sua_url_do_supabase" e "sua_chave_anonima_do_supabase" pelas credenciais que você obteve no passo anterior.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Passo 5: Configure o banco de dados */}
          {currentStep === 5 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">5</span>
              </div>
              <h4 className="text-sm font-medium">Configure o banco de dados</h4>
              <p className="text-xs text-gray-600 mt-1">
                Execute os scripts SQL necessários para criar as tabelas e funções no Supabase.
              </p>
              <ol className="mt-3 space-y-2 text-xs text-gray-600 list-decimal pl-4">
                <li>
                  <strong>Habilite a extensão uuid-ossp:</strong>
                  <div className="mt-1 bg-gray-900 text-gray-100 p-2 rounded-md font-mono">
                    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                  </div>
                </li>
                <li>
                  <strong>Crie as tabelas necessárias:</strong>
                  <div className="mt-1">
                    Use o botão "SQL Tables" na página de teste para copiar o script SQL completo.
                  </div>
                </li>
                <li>
                  <strong>Crie a função para verificação da estrutura das tabelas:</strong>
                  <div className="mt-1">
                    Use o botão "SQL Function" na página de teste para copiar o script SQL.
                  </div>
                </li>
              </ol>
              <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-2 text-xs text-green-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    Após executar os scripts, use os componentes "Table Check" e "Table Structure Check" na página de teste para verificar se tudo foi configurado corretamente.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Passo 6: Inicie o servidor de desenvolvimento */}
          {currentStep === 6 && (
            <div className="pl-6 relative">
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center -translate-x-2">
                <span className="text-white text-xs">6</span>
              </div>
              <h4 className="text-sm font-medium">Inicie o servidor de desenvolvimento</h4>
              <p className="text-xs text-gray-600 mt-1">
                Inicie o servidor de desenvolvimento para começar a usar a aplicação.
              </p>
              <div className="mt-3 bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>npm run dev</span>
                </div>
                <div className="mt-2 text-gray-400">
                  # ou, se você preferir usar yarn
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  <span>yarn dev</span>
                </div>
              </div>
              <div className="mt-3 bg-green-50 border border-green-200 rounded-md p-2 text-xs text-green-700">
                <div className="flex items-start gap-2">
                  <Play className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    Acesse <span className="font-mono">http://localhost:5173</span> no seu navegador para ver a aplicação em funcionamento.
                    Para acessar a página de teste e diagnóstico, vá para <span className="font-mono">http://localhost:5173/test</span>.
                  </div>
                </div>
              </div>
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <strong>Parabéns!</strong> Você concluiu a instalação e configuração do EventosPira Hub.
                    Se encontrar algum problema, consulte o "Guia de Solução de Problemas" na página de teste.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 