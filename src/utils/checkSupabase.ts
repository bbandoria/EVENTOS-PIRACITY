import { supabase, checkPublicAccess } from '@/services/supabase';

export async function checkSupabaseConnection() {
  try {
    console.log('Verificando conexão com o Supabase...');
    
    // Tenta fazer uma consulta simples para verificar a conexão
    // Usando select('id') em vez de count() para evitar erros 400
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erro ao conectar com Supabase:', error);
      return {
        connected: false,
        message: `Erro de conexão: ${error.message}`,
        error
      };
    }
    
    // Verificar acesso público
    console.log('Verificando políticas de acesso público...');
    const publicAccessResult = await checkPublicAccess();
    
    return {
      connected: true,
      message: 'Conexão com Supabase estabelecida com sucesso',
      data,
      publicAccess: publicAccessResult
    };
  } catch (error) {
    console.error('Exceção ao verificar conexão:', error);
    return {
      connected: false,
      message: `Exceção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      error
    };
  }
} 