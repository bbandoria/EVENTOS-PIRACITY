# EventosPira Hub

Uma aplicação para visualização e gerenciamento de eventos na cidade de Piracicaba.

## Sobre o Projeto

EventosPira Hub é uma aplicação web desenvolvida com React, TypeScript e Tailwind CSS, que utiliza o Supabase como backend para armazenamento de dados. A aplicação permite visualizar eventos, criar novos eventos, e favoritar eventos de interesse.

## Configuração do Ambiente

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/eventos-pira-hub.git
   cd eventos-pira-hub
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     VITE_SUPABASE_URL=sua_url_do_supabase
     VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
     NODE_ENV=development
     ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

## Configuração do Supabase

### Criação do Projeto no Supabase

1. Acesse [app.supabase.io](https://app.supabase.io) e faça login
2. Clique em "New Project"
3. Preencha os detalhes do projeto e clique em "Create new project"
4. Após a criação, vá para "Settings" > "API" para obter a URL e a chave anônima

### Configuração do Banco de Dados

1. Habilite a extensão uuid-ossp:
   - Acesse o painel do Supabase
   - Vá para "SQL Editor"
   - Execute o seguinte comando:
     ```sql
     CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
     ```

2. Crie as tabelas necessárias:
   - Acesse o painel do Supabase
   - Vá para "SQL Editor"
   - Execute o script SQL disponível na página de teste da aplicação (botão "SQL Tables")

3. Crie a função para verificação da estrutura das tabelas:
   - Acesse o painel do Supabase
   - Vá para "SQL Editor"
   - Execute o script SQL disponível na página de teste da aplicação (botão "SQL Function")

## Página de Teste e Diagnóstico

A aplicação inclui uma página de teste e diagnóstico que oferece várias ferramentas para verificar a configuração do Supabase e solucionar problemas. Para acessar esta página:

1. Inicie a aplicação
2. Acesse a rota `/test` no navegador (ex: http://localhost:5173/test)

### Ferramentas Disponíveis

- **Guia de Solução de Problemas**: Contém soluções para problemas comuns encontrados ao configurar e usar o Supabase.
- **Table Check**: Verifica se as tabelas necessárias existem no Supabase.
- **Table Structure Check**: Verifica a estrutura das tabelas no Supabase, mostrando as colunas e seus tipos.
- **SQL Function Viewer**: Exibe o script SQL para criar a função get_table_columns.
- **SQL Tables Viewer**: Exibe o script SQL para criar as tabelas necessárias.
- **UUID Extension Info**: Exibe informações sobre a extensão uuid-ossp e como habilitá-la.
- **Supabase Error Details**: Exibe detalhes sobre erros encontrados ao se conectar ao Supabase.
- **SQL Syntax Fix**: Exibe informações sobre correções de sintaxe SQL para políticas de segurança.
- **Logs do Supabase**: Exibe informações sobre como acessar e interpretar os logs do Supabase.

## Solução de Problemas Comuns

### Erro 401 (Unauthorized)

- Verifique se as credenciais do Supabase estão corretas no arquivo `.env`
- Obtenha novas credenciais no painel do Supabase em "Settings" > "API"
- Reinicie o servidor de desenvolvimento após atualizar o arquivo `.env`

### Erro 400 (Bad Request)

- Verifique se as tabelas têm a estrutura correta
- Verifique se as consultas SQL estão corretas
- Verifique se os dados enviados estão no formato correto

### Tabelas não existem

- Execute o script SQL para criar as tabelas
- Verifique se a extensão uuid-ossp está habilitada
- Use o componente "Table Structure Check" para verificar a estrutura das tabelas

### Problemas com RLS (Row Level Security)

- Verifique se o RLS está habilitado para todas as tabelas
- Verifique se as políticas de RLS estão configuradas corretamente
- Execute o script SQL novamente para recriar as políticas

## Funcionalidades

- Visualização de eventos
- Criação de eventos de teste
- Verificação da conexão com o Supabase
- Diagnóstico de problemas com o Supabase

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Supabase
- Vite
- React Router
- Lucide Icons
- Shadcn UI

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT.
"# EVENTOS-PIRACITY" 
