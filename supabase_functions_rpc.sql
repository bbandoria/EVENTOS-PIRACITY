-- Função para verificar as políticas de acesso de uma tabela
-- Execute este script no SQL Editor do Supabase

-- Criar função para obter informações sobre as políticas de uma tabela
CREATE OR REPLACE FUNCTION get_policies_info(table_name text)
RETURNS TABLE (
  policyname text,
  permissive text,
  roles text[],
  cmd text,
  qual text,
  with_check text
) LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.policyname::text,
    p.permissive::text,
    p.roles::text[],
    p.cmd::text,
    p.qual::text,
    p.with_check::text
  FROM pg_policies p
  WHERE p.tablename = table_name;
END;
$$;

-- Conceder permissão para executar a função anonimamente
GRANT EXECUTE ON FUNCTION get_policies_info(text) TO anon;

-- Verificar se a função foi criada corretamente
SELECT * FROM pg_proc WHERE proname = 'get_policies_info';

-- Testar a função
SELECT * FROM get_policies_info('events');
SELECT * FROM get_policies_info('venues'); 