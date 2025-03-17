import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';

export function DiagnosticBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
      <div className="flex items-start gap-3">
        <Wrench className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <h3 className="font-medium text-blue-800">Ferramentas de diagnóstico disponíveis</h3>
          <p className="text-sm text-blue-700 mt-1">
            Se você está enfrentando problemas com o carregamento de eventos, 
            utilize nossa página de diagnóstico para verificar a conexão com o Supabase.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-blue-100 border-blue-200 text-blue-800 hover:bg-blue-200 hover:text-blue-900"
              asChild
            >
              <Link to="/test">
                <Wrench className="h-4 w-4 mr-1.5" />
                Acessar ferramentas de diagnóstico
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              onClick={() => setIsVisible(false)}
            >
              Dispensar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 