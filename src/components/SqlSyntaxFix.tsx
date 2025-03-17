import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Code, ChevronDown, ChevronUp } from 'lucide-react';

export function SqlSyntaxFix() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-36 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        SQL Syntax Fix
      </Button>
    );
  }

  return (
    <div className="fixed bottom-36 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Correção de Sintaxe SQL</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Erro de sintaxe corrigido</h4>
            <p className="text-xs text-amber-700 mt-1">
              O script SQL original continha um erro de sintaxe nas políticas de segurança. 
              A sintaxe <code className="bg-amber-100 px-1 rounded">IF NOT EXISTS</code> não é suportada para políticas no PostgreSQL.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Erro encontrado</h4>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <pre className="text-xs text-red-800 whitespace-pre-wrap">ERROR: 42601: syntax error at or near "NOT"
LINE 46: CREATE POLICY IF NOT EXISTS venues_select_policy ON venues FOR SELECT USING (true);</pre>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Solução aplicada</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Removemos a sintaxe <code className="bg-muted px-1 rounded">IF NOT EXISTS</code> das declarações <code className="bg-muted px-1 rounded">CREATE POLICY</code> e adicionamos <code className="bg-muted px-1 rounded">DROP POLICY IF EXISTS</code> antes de cada criação de política.
          </p>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-sm mb-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Ocultar detalhes
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Mostrar detalhes
              </>
            )}
          </Button>
          
          {showDetails && (
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-medium mb-1">Código original (com erro):</h5>
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <pre className="text-xs text-red-800 whitespace-pre-wrap">-- Permitir leitura anônima para venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS venues_select_policy ON venues FOR SELECT USING (true);</pre>
                </div>
              </div>
              
              <div>
                <h5 className="text-xs font-medium mb-1">Código corrigido:</h5>
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <pre className="text-xs text-green-800 whitespace-pre-wrap">-- Permitir leitura anônima para venues
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS venues_select_policy ON venues;
CREATE POLICY venues_select_policy ON venues FOR SELECT USING (true);</pre>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Documentação</h4>
          <p className="text-sm text-muted-foreground">
            Para mais informações sobre políticas de segurança no PostgreSQL, consulte a <a href="https://www.postgresql.org/docs/current/sql-createpolicy.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">documentação oficial</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 