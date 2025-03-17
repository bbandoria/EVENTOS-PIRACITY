import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Github, 
  ExternalLink, 
  Code, 
  Database, 
  Package, 
  FileText
} from 'lucide-react';

export function ProjectInfo() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed top-20 right-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Info className="h-4 w-4 mr-2" />
        Sobre o Projeto
      </Button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Sobre o EventosPira Hub</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Descrição do Projeto</h4>
              <p className="text-xs text-blue-700 mt-1">
                EventosPira Hub é uma aplicação web desenvolvida com React, TypeScript e Tailwind CSS, 
                que utiliza o Supabase como backend para armazenamento de dados. A aplicação permite 
                visualizar eventos, criar novos eventos, e favoritar eventos de interesse na cidade de Piracicaba.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-start gap-2">
            <Code className="h-5 w-5 text-indigo-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Tecnologias Utilizadas</h4>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">React</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">TypeScript</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Tailwind CSS</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Supabase</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Vite</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">React Router</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Lucide Icons</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-gray-700">Shadcn UI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-start gap-2">
            <Database className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Estrutura do Banco de Dados</h4>
              <p className="text-xs text-gray-600 mt-1">
                O projeto utiliza o Supabase como banco de dados, com as seguintes tabelas:
              </p>
              <ul className="mt-2 space-y-2 text-xs text-gray-600">
                <li className="border-l-2 border-green-300 pl-2">
                  <strong>venues</strong> - Armazena informações sobre locais de eventos
                  <div className="mt-1 text-gray-500">
                    Colunas: id, name, address, created_at, updated_at
                  </div>
                </li>
                <li className="border-l-2 border-blue-300 pl-2">
                  <strong>events</strong> - Armazena informações sobre eventos
                  <div className="mt-1 text-gray-500">
                    Colunas: id, title, description, date, venue_id, created_at, updated_at
                  </div>
                </li>
                <li className="border-l-2 border-purple-300 pl-2">
                  <strong>favorites</strong> - Armazena favoritos dos usuários
                  <div className="mt-1 text-gray-500">
                    Colunas: id, user_id, event_id, created_at
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-start gap-2">
            <Package className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Funcionalidades</h4>
              <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc pl-4">
                <li>Visualização de eventos</li>
                <li>Criação de eventos de teste</li>
                <li>Verificação da conexão com o Supabase</li>
                <li>Diagnóstico de problemas com o Supabase</li>
                <li>Ferramentas de solução de problemas</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-md p-3 bg-white">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Documentação</h4>
              <p className="text-xs text-gray-600 mt-1">
                Para mais informações sobre o projeto, consulte o arquivo README.md na raiz do projeto.
              </p>
              <div className="mt-2">
                <a 
                  href="https://github.com/seu-usuario/eventos-pira-hub" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                >
                  <Github className="h-3 w-3 mr-1" />
                  Repositório no GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Licença</h4>
              <p className="text-xs text-gray-600 mt-1">
                Este projeto está licenciado sob a licença MIT.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Copyright © 2023 EventosPira Hub
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 