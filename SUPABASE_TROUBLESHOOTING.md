# Guia de Solução de Problemas do Supabase

Este guia ajudará você a resolver problemas comuns relacionados à conexão com o Supabase na aplicação EventosPira.

## Problemas Comuns

### 1. Eventos não aparecem na página inicial

Se os eventos não estão aparecendo na página inicial, mas você sabe que existem eventos no banco de dados, verifique:

- **Variáveis de ambiente**: Certifique-se de que as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas corretamente no arquivo `.env`.
- **Conexão com o Supabase**: Use a página de teste (/test) para verificar se a conexão com o Supabase está funcionando.
- **Console do navegador**: Verifique se há erros no console do navegador que possam indicar problemas de conexão.

### 2. Erro ao criar eventos de teste

Se você está recebendo um erro ao tentar criar eventos de teste, pode ser devido a:

- **Permissões do Supabase**: Verifique se o usuário anônimo tem permissões para inserir dados nas tabelas `venues` e `events`.
- **Estrutura das tabelas**: Certifique-se de que as tabelas `venues` e `events` existem e têm a estrutura correta.
- **Restrições de chave única**: Se você vê um erro como `there is no unique or exclusion constraint matching the ON CONFLICT specification`, significa que a tabela não tem a restrição de chave única especificada.

### 3. Erro de conexão com o Supabase

Se você está vendo erros de conexão com o Supabase:

- **URL e chave**: Verifique se a URL e a chave anônima do Supabase estão corretas.
- **Firewall**: Certifique-se de que seu firewall não está bloqueando conexões com o Supabase.
- **CORS**: Verifique se o Supabase está configurado para permitir solicitações do seu domínio.

### 4. Erro 401 (Unauthorized) ao acessar o Supabase

Se você está recebendo erros 401 (Unauthorized) ao tentar acessar o Supabase, isso geralmente indica um problema com a chave de API anônima:

- **Chave expirada**: As chaves do Supabase podem expirar. Verifique a data de expiração da chave usando o componente `SupabaseKeyInfo` na página de teste.
- **Chave incorreta**: Certifique-se de que a chave anônima no arquivo `.env` está correta e completa.
- **Projeto desativado**: Verifique se o projeto Supabase está ativo e não foi desativado ou colocado em modo de manutenção.
- **Regenerar chave**: Se necessário, regenere a chave anônima no painel do Supabase:
  1. Acesse o painel do Supabase (https://app.supabase.io)
  2. Selecione seu projeto
  3. Vá para "Configurações do Projeto" > "API"
  4. Na seção "Project API keys", copie a chave "anon public"
  5. Atualize o arquivo `.env` com a nova chave

```
VITE_SUPABASE_ANON_KEY=sua-nova-chave-aqui
```

- **Limpar cache**: Tente limpar o cache do navegador e recarregar a página.
- **Verificar formato da chave**: A chave anônima deve ser um token JWT válido. Ela geralmente começa com "ey" e contém três seções separadas por pontos.

### 5. Erro de sintaxe ao executar o script SQL

Se você encontrar um erro como `ERROR: 42601: syntax error at or near "NOT"` ao executar o script SQL, isso ocorre porque a sintaxe `IF NOT EXISTS` não é suportada para políticas no PostgreSQL.

Para corrigir este erro:
- Remova `IF NOT EXISTS` das declarações `CREATE POLICY`
- Adicione `DROP POLICY IF EXISTS` antes de cada `CREATE POLICY` para garantir que não haverá conflitos

Exemplo correto:
```sql
-- Incorreto
CREATE POLICY IF NOT EXISTS policy_name ON table_name FOR SELECT USING (true);

-- Correto
DROP POLICY IF EXISTS policy_name ON table_name;
CREATE POLICY policy_name ON table_name FOR SELECT USING (true);
```

## Como verificar a configuração

1. Acesse a página de teste em `/test`
2. Clique no botão "Verificar Conexão" para testar a conexão com o Supabase
3. Use o botão "Env Debug" no canto inferior esquerdo para verificar as variáveis de ambiente
4. Use o botão "Table Check" para verificar se as tabelas necessárias existem no Supabase

## Como configurar o arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-nova-chave-aqui
```

Substitua `seu-projeto` e `sua-nova-chave-aqui` pelos valores corretos do seu projeto Supabase.

## Como criar as tabelas no Supabase

Se as tabelas necessárias não existirem, você pode criá-las usando o script SQL fornecido:

1. Acesse o painel de controle do Supabase
2. Vá para a seção "SQL Editor"
3. Clique em "New Query"
4. Cole o conteúdo do arquivo `supabase_tables.sql` no editor
5. Clique em "Run" para executar o script

O script criará as seguintes tabelas:
- `venues` - para armazenar informações sobre locais
- `events` - para armazenar informações sobre eventos
- `favorites` - para armazenar favoritos dos usuários

Além disso, o script configura:
- Índices para melhorar a performance
- Políticas de segurança para permitir acesso anônimo (para fins de teste)

## Como verificar as tabelas no Supabase

1. Acesse o painel de controle do Supabase
2. Vá para a seção "Table Editor"
3. Verifique se as tabelas `venues`, `events` e `favorites` existem
4. Verifique a estrutura das tabelas para garantir que elas têm as colunas corretas
5. Alternativamente, use o componente "Table Check" na página de teste da aplicação

## Estrutura esperada das tabelas

### Tabela `venues`

- `id` (uuid, primary key)
- `name` (text)
- `address` (text)
- `description` (text)
- `image_url` (text)
- `latitude` (float8)
- `longitude` (float8)
- `owner_id` (text)
- `created_at` (timestamp with time zone)

### Tabela `events`

- `id` (uuid, primary key)
- `title` (text)
- `description` (text)
- `date` (date)
- `time` (text)
- `image_url` (text)
- `venue_id` (uuid, foreign key referencing venues.id)
- `category` (text)
- `owner_id` (text)
- `created_at` (timestamp with time zone)

### Tabela `favorites`

- `id` (uuid, primary key)
- `user_id` (text)
- `event_id` (uuid, foreign key referencing events.id)
- `created_at` (timestamp with time zone)
- Restrição única em (user_id, event_id) 