import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Copy, Check, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SqlPoliciesViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sqlScript = `-- Script para configurar políticas de acesso no Supabase
-- Execute este script no SQL Editor do Supabase

-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela events
-- Permitir leitura pública (SELECT) para todos os usuários, incluindo anônimos
CREATE POLICY "Permitir leitura pública de eventos" 
  ON events FOR SELECT 
  USING (true);

-- Permitir que usuários autenticados criem seus próprios eventos
CREATE POLICY "Permitir usuários autenticados criar eventos" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Permitir que usuários autenticados atualizem seus próprios eventos
CREATE POLICY "Permitir usuários autenticados atualizar seus eventos" 
  ON events FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Permitir que usuários autenticados excluam seus próprios eventos
CREATE POLICY "Permitir usuários autenticados excluir seus eventos" 
  ON events FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Políticas para a tabela venues
-- Permitir leitura pública (SELECT) para todos os usuários, incluindo anônimos
CREATE POLICY "Permitir leitura pública de locais" 
  ON venues FOR SELECT 
  USING (true);

-- Permitir que usuários autenticados criem seus próprios locais
CREATE POLICY "Permitir usuários autenticados criar locais" 
  ON venues FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);

-- Permitir que usuários autenticados atualizem seus próprios locais
CREATE POLICY "Permitir usuários autenticados atualizar seus locais" 
  ON venues FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Permitir que usuários autenticados excluam seus próprios locais
CREATE POLICY "Permitir usuários autenticados excluir seus locais" 
  ON venues FOR DELETE 
  TO authenticated 
  USING (auth.uid() = owner_id);

-- Políticas para a tabela favorites
-- Permitir que usuários autenticados vejam seus próprios favoritos
CREATE POLICY "Permitir usuários autenticados ver seus favoritos" 
  ON favorites FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Permitir que usuários autenticados adicionem favoritos
CREATE POLICY "Permitir usuários autenticados adicionar favoritos" 
  ON favorites FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Permitir que usuários autenticados removam seus próprios favoritos
CREATE POLICY "Permitir usuários autenticados remover seus favoritos" 
  ON favorites FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <Button
        variant="outline"
        className="w-full flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          SQL para Políticas de Acesso
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <Card className="mt-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Script SQL para Políticas de Acesso</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              Execute este script no SQL Editor do Supabase para configurar as políticas de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Este script configura políticas de acesso para permitir leitura pública de eventos e locais,
                enquanto restringe operações de escrita apenas para usuários autenticados e donos dos registros.
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">
                {sqlScript}
              </pre>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong>Nota:</strong> Após executar este script, verifique se as políticas foram criadas corretamente
                usando o componente "Verificar Políticas de Acesso" disponível na página de testes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 