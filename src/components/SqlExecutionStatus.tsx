import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SqlExecutionStatusProps {
  onClose: () => void;
}

export function SqlExecutionStatus({ onClose }: SqlExecutionStatusProps) {
  const [status, setStatus] = useState<'success' | 'error' | 'warning' | 'unknown'>('unknown');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusChange = (newStatus: 'success' | 'error' | 'warning' | 'unknown', message: string = '') => {
    setStatus(newStatus);
    setErrorMessage(message);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      default:
        return <HelpCircle className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Script SQL executado com sucesso';
      case 'error':
        return 'Erro ao executar o script SQL';
      case 'warning':
        return 'Script SQL executado com avisos';
      default:
        return 'Status da execução do script SQL';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'success':
        return 'Todas as tabelas e políticas foram criadas com sucesso.';
      case 'error':
        return `Ocorreu um erro ao executar o script SQL: ${errorMessage}`;
      case 'warning':
        return 'O script foi executado, mas com alguns avisos.';
      default:
        return 'Informe o status da execução do script SQL no Supabase.';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        {getStatusIcon()}
        <div className="flex-grow">
          <h3 className="font-medium">{getStatusTitle()}</h3>
          <p className="text-sm mt-1">{getStatusDescription()}</p>
          
          {status === 'unknown' && (
            <div className="mt-4 space-y-3">
              <p className="text-sm">Como foi a execução do script SQL?</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-green-100 border-green-200 text-green-800 hover:bg-green-200"
                  onClick={() => handleStatusChange('success')}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  Sucesso
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                  onClick={() => handleStatusChange('warning')}
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  Avisos
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-red-100 border-red-200 text-red-800 hover:bg-red-200"
                  onClick={() => handleStatusChange('error')}
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Erro
                </Button>
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-800 bg-red-100 border-red-200 hover:bg-red-200"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Ocultar detalhes' : 'Mostrar detalhes'}
              </Button>
              
              {showDetails && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 text-xs border border-red-200 rounded bg-red-50 text-red-800"
                    rows={3}
                    placeholder="Cole a mensagem de erro aqui..."
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                  />
                </div>
              )}
              
              <div className="mt-3 text-sm">
                <p>Possíveis soluções:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Verifique se você tem permissões para criar tabelas e políticas no Supabase.</li>
                  <li>Verifique se as tabelas já existem e tente executar apenas as partes do script que faltam.</li>
                  <li>Consulte o guia de solução de problemas para mais informações.</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClose}
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 