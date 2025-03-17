import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Key, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function SupabaseKeyInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isValidUrl = supabaseUrl && supabaseUrl.includes('supabase.co');
  const isValidKey = supabaseKey && supabaseKey.length > 50;
  
  // Decodificar o JWT para verificar a data de expiração
  const decodeJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  };
  
  const decodedToken = supabaseKey ? decodeJwt(supabaseKey) : null;
  const isExpired = decodedToken ? decodedToken.exp * 1000 < Date.now() : false;
  const expirationDate = decodedToken ? new Date(decodedToken.exp * 1000).toLocaleString() : 'Desconhecido';
  const issuedDate = decodedToken ? new Date(decodedToken.iat * 1000).toLocaleString() : 'Desconhecido';
  
  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-52 left-4 z-50"
        onClick={() => setIsOpen(true)}
      >
        <Key className="h-4 w-4 mr-2" />
        Supabase Key Info
      </Button>
    );
  }
  
  return (
    <div className="fixed bottom-52 left-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Informações da Chave Supabase</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">URL do Supabase</h4>
          <div className="flex items-center gap-2">
            {isValidUrl ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <code className="text-xs bg-muted p-1 rounded">{supabaseUrl || 'Não definido'}</code>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Chave Anônima</h4>
          <div className="flex items-center gap-2 mb-2">
            {isValidKey ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <code className="text-xs bg-muted p-1 rounded overflow-hidden text-ellipsis">
              {supabaseKey 
                ? (showFullKey ? supabaseKey : `${supabaseKey.substring(0, 20)}...`) 
                : 'Não definido'}
            </code>
            {supabaseKey && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowFullKey(!showFullKey)}
              >
                {showFullKey ? 'Ocultar' : 'Mostrar'}
              </Button>
            )}
          </div>
        </div>
        
        {decodedToken && (
          <div>
            <h4 className="text-sm font-medium mb-2">Informações do Token</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="font-medium">Projeto:</span>
                <span>{decodedToken.ref || 'Não disponível'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Função:</span>
                <span>{decodedToken.role || 'Não disponível'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Emitido em:</span>
                <span>{issuedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Expira em:</span>
                <span className={isExpired ? 'text-red-500' : 'text-green-500'}>
                  {expirationDate}
                  {isExpired ? ' (Expirado)' : ' (Válido)'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {isExpired && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Token expirado</h4>
                <p className="text-xs text-red-700 mt-1">
                  A chave anônima do Supabase expirou. Você precisa gerar uma nova chave no painel do Supabase.
                </p>
                <ol className="text-xs text-red-700 mt-2 list-decimal pl-4 space-y-1">
                  <li>Acesse o painel do Supabase</li>
                  <li>Navegue até "Configurações do Projeto" &gt; "API"</li>
                  <li>Copie a chave anônima (anon public)</li>
                  <li>Atualize o arquivo .env com a nova chave</li>
                </ol>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Dica</h4>
              <p className="text-xs text-blue-700 mt-1">
                Se você estiver enfrentando erros 401 (Unauthorized), verifique se a chave anônima está correta e não expirou.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 