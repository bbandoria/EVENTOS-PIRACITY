-- Função para obter informações sobre as colunas de uma tabela
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
END;
$$ LANGUAGE plpgsql; 