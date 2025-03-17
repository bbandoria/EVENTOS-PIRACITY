/**
 * Utilitário para verificar as variáveis de ambiente do Supabase
 */

export function checkSupabaseEnv() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const issues = [];
  
  if (!supabaseUrl) {
    issues.push('VITE_SUPABASE_URL não está definido');
  } else if (!supabaseUrl.includes('supabase.co')) {
    issues.push('VITE_SUPABASE_URL não parece ser uma URL válida do Supabase');
  }
  
  if (!supabaseKey) {
    issues.push('VITE_SUPABASE_ANON_KEY não está definido');
  } else if (supabaseKey.length < 20) {
    issues.push('VITE_SUPABASE_ANON_KEY parece ser muito curto para uma chave válida');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    env: {
      VITE_SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'não definido',
      VITE_SUPABASE_ANON_KEY: supabaseKey ? `${supabaseKey.substring(0, 5)}...` : 'não definido',
    }
  };
}

// Executar verificação ao inicializar
const envCheck = checkSupabaseEnv();
console.log('Verificação de variáveis de ambiente do Supabase:', 
  envCheck.isValid ? 'OK' : 'Problemas encontrados');

if (!envCheck.isValid) {
  console.error('Problemas com as variáveis de ambiente do Supabase:', envCheck.issues);
  console.log('Dica: Crie um arquivo .env na raiz do projeto com as variáveis necessárias.');
  console.log('Você pode usar o arquivo .env.example como referência.');
} 