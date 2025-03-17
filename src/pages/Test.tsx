import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import { DirectEvents } from '@/components/DirectEvents';
import { Debug } from '@/components/Debug';
import { EnvDebug } from '@/components/EnvDebug';
import { TableCheck } from '@/components/TableCheck';
import { SqlScriptViewer } from '@/components/SqlScriptViewer';
import { SqlSyntaxFix } from '@/components/SqlSyntaxFix';
import { SupabaseKeyInfo } from '@/components/SupabaseKeyInfo';
import { SupabaseErrorDetails } from '@/components/SupabaseErrorDetails';
import { TableStructureCheck } from '@/components/TableStructureCheck';
import { PolicyCheck } from '@/components/PolicyCheck';
import { SqlPoliciesViewer } from '@/components/SqlPoliciesViewer';
import { RpcFunctionInfo } from '@/components/RpcFunctionInfo';
import { seedEvents } from '@/utils/seedEvents';
import { checkSupabaseConnection } from '@/utils/checkSupabase';
import { FileText } from 'lucide-react';
import { SqlFunctionViewer } from '@/components/SqlFunctionViewer';
import { SqlTablesViewer } from '@/components/SqlTablesViewer';
import { UuidExtensionInfo } from '@/components/UuidExtensionInfo';
import { TroubleshootingGuide } from '@/components/TroubleshootingGuide';
import { ToolsSummary } from '@/components/ToolsSummary';
import { SupabaseLogs } from '@/components/SupabaseLogs';
import { ProjectInfo } from '@/components/ProjectInfo';
import { InstallationGuide } from '@/components/InstallationGuide';
import { SupabaseConnectionStatus } from '@/components/SupabaseConnectionStatus';

export default function Test() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const result = await checkSupabaseConnection();
      setConnectionStatus(result);
      
      if (result.connected) {
        toast.success('Conexão com o Supabase verificada com sucesso');
      } else {
        toast.error(`Erro na conexão: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      toast.error('Erro ao verificar conexão');
      setConnectionStatus({
        connected: false,
        message: String(error),
        data: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedEvents = async () => {
    try {
      setLoading(true);
      const result = await seedEvents();
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Erro ao criar eventos de teste:', error);
      toast.error('Erro ao criar eventos de teste');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <Header />
      <DirectEvents />
      <Debug />
      <EnvDebug />
      <TableCheck />
      <TableStructureCheck />
      <PolicyCheck />
      <SqlFunctionViewer />
      <SqlTablesViewer />
      <SqlPoliciesViewer />
      <RpcFunctionInfo />
      <UuidExtensionInfo />
      <TroubleshootingGuide />
      <ToolsSummary />
      <SupabaseLogs />
      <ProjectInfo />
      <InstallationGuide />
      <SupabaseErrorDetails />
      <SqlSyntaxFix />
      <SupabaseConnectionStatus />
      
      <div className="mt-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Página de Testes</h1>
            <div className="flex gap-2">
              <Button 
                onClick={checkConnection} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Verificando...' : 'Verificar Conexão'}
              </Button>
              <Button 
                onClick={handleSeedEvents} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Criando...' : 'Criar Eventos de Teste'}
              </Button>
            </div>
          </div>

          {connectionStatus && (
            <div className="p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-2">Status da Conexão</h2>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(connectionStatus, null, 2)}
              </pre>
              
              {connectionStatus.publicAccess && (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Status do Acesso Público</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">Tabela: events</h4>
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">Existe:</span> {connectionStatus.publicAccess.tables.events.exists ? 'Sim' : 'Não'}
                        </div>
                        {connectionStatus.publicAccess.tables.events.error && (
                          <div className="mb-1 text-red-600">
                            <span className="font-medium">Erro:</span> {connectionStatus.publicAccess.tables.events.error}
                          </div>
                        )}
                        <div className="mb-1">
                          <span className="font-medium">Políticas:</span> {connectionStatus.publicAccess.tables.events.policies?.length || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3">
                      <h4 className="font-medium mb-2">Tabela: venues</h4>
                      <div>
                        <div className="mb-1">
                          <span className="font-medium">Existe:</span> {connectionStatus.publicAccess.tables.venues.exists ? 'Sim' : 'Não'}
                        </div>
                        {connectionStatus.publicAccess.tables.venues.error && (
                          <div className="mb-1 text-red-600">
                            <span className="font-medium">Erro:</span> {connectionStatus.publicAccess.tables.venues.error}
                          </div>
                        )}
                        <div className="mb-1">
                          <span className="font-medium">Políticas:</span> {connectionStatus.publicAccess.tables.venues.policies?.length || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 