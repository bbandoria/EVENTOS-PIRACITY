import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ChevronDown, ChevronUp, ExternalLink, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { checkPublicAccess } from '@/services/supabase';

interface AccessCheckResult {
  hasPublicAccess: boolean;
  tables: {
    events: { exists: boolean; error: string | null; policies: any[] };
    venues: { exists: boolean; error: string | null; policies: any[] };
  };
  details: string;
}

export function PublicAccessInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [accessStatus, setAccessStatus] = useState<AccessCheckResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAccess = async () => {
    setLoading(true);
    try {
      const result = await checkPublicAccess();
      setAccessStatus(result);
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !accessStatus) {
      checkAccess();
    }
  }, [isOpen, accessStatus]);

  const hasAnonSelectPolicy = (policies: any[]) => {
    return policies.some(policy => 
      policy.cmd === 'SELECT' && policy.roles.includes('anon')
    );
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-yellow-500" />
            Configuração de Acesso Público
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          Instruções para configurar o acesso público aos eventos no Supabase
        </CardDescription>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Status do Acesso Público</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkAccess} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar Novamente'
                )}
              </Button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center p-4 border rounded-md">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Verificando acesso público...</span>
              </div>
            ) : accessStatus ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status Geral:</span>
                  {accessStatus.hasPublicAccess ? (
                    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Acesso Público Configurado
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      Acesso Público Não Configurado
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status da tabela events */}
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Tabela: events</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Existe:</span>
                        {accessStatus.tables.events.exists ? (
                          <Badge className="bg-green-100 text-green-800">Sim</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Não</Badge>
                        )}
                      </div>
                      
                      {accessStatus.tables.events.error && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">Erro:</span> {accessStatus.tables.events.error}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Política SELECT para anon:</span>
                        {accessStatus.tables.events.policies && 
                         hasAnonSelectPolicy(accessStatus.tables.events.policies) ? (
                          <Badge className="bg-green-100 text-green-800">Configurada</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Não Configurada</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Políticas:</span> {accessStatus.tables.events.policies?.length || 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status da tabela venues */}
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium mb-2">Tabela: venues</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Existe:</span>
                        {accessStatus.tables.venues.exists ? (
                          <Badge className="bg-green-100 text-green-800">Sim</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Não</Badge>
                        )}
                      </div>
                      
                      {accessStatus.tables.venues.error && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">Erro:</span> {accessStatus.tables.venues.error}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Política SELECT para anon:</span>
                        {accessStatus.tables.venues.policies && 
                         hasAnonSelectPolicy(accessStatus.tables.venues.policies) ? (
                          <Badge className="bg-green-100 text-green-800">Configurada</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Não Configurada</Badge>
                        )}
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">Políticas:</span> {accessStatus.tables.venues.policies?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!accessStatus.hasPublicAccess && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      {accessStatus.details || 'Problemas encontrados na configuração de acesso público.'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verificação Pendente</AlertTitle>
                <AlertDescription>
                  Clique em "Verificar Novamente" para verificar o status do acesso público.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Se os eventos não estão aparecendo para usuários não logados, você precisa configurar as políticas de acesso no Supabase.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <h3 className="font-medium">Siga estas etapas:</h3>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Acesse o painel de controle do Supabase</li>
              <li>Navegue até "Authentication" &gt; "Policies"</li>
              <li>Selecione a tabela "events"</li>
              <li>Clique em "New Policy"</li>
              <li>Selecione "Custom policy"</li>
              <li>Dê um nome como "Permitir leitura pública de eventos"</li>
              <li>Selecione "SELECT" como operação</li>
              <li>Na expressão USING, digite simplesmente <code>true</code></li>
              <li>Clique em "Save Policy"</li>
              <li>Repita o processo para a tabela "venues"</li>
            </ol>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Ou execute este SQL no Editor SQL:</h3>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                {`-- Política para permitir leitura pública de eventos
CREATE POLICY "Permitir leitura pública de eventos" ON events
FOR SELECT USING (true);

-- Política para permitir leitura pública de locais
CREATE POLICY "Permitir leitura pública de locais" ON venues
FOR SELECT USING (true);`}
              </pre>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro comum: Sintaxe de política INSERT</AlertTitle>
              <AlertDescription>
                Se você encontrar o erro <code>42601: only WITH CHECK expression allowed for INSERT</code>, 
                lembre-se que políticas INSERT devem usar apenas a cláusula WITH CHECK, sem a cláusula USING:
              </AlertDescription>
            </Alert>
            
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto mt-2">
              {`-- Sintaxe CORRETA para política INSERT
CREATE POLICY "Permitir usuários autenticados criar eventos" ON events
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Sintaxe INCORRETA (causará erro)
CREATE POLICY "Política com erro" ON events
FOR INSERT TO authenticated USING (true) WITH CHECK (auth.uid() = owner_id);`}
            </pre>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener noreferrer">
                  Documentação do Supabase
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
} 