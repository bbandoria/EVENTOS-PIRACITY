import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verificar se o usuário está logado
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Sessão atual:', session);
      
      if (!session?.user) {
        console.log('Usuário não está logado');
        toast.error('Você precisa estar logado para acessar esta página');
        setIsAdmin(false);
        return;
      }

      console.log('Verificando permissões de admin para o usuário:', session.user.email);

      // Verificar se o usuário é admin
      const { data: adminData, error } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      console.log('Resultado da verificação de admin:', { adminData, error });

      if (error) {
        if (error.code === 'PGRST116') {
          // Usuário não é admin
          console.log('Usuário não é admin');
          toast.error('Você não tem permissão para acessar o painel administrativo');
          setIsAdmin(false);
          // Fazer logout do usuário que não é admin
          await supabase.auth.signOut();
        } else {
          // Erro inesperado
          console.error('Erro ao verificar permissões de admin:', error);
          toast.error('Erro ao verificar permissões. Tente novamente mais tarde.');
          setIsAdmin(false);
        }
        return;
      }

      if (adminData) {
        console.log('Usuário é admin');
        setIsAdmin(true);
        toast.success('Bem-vindo ao painel administrativo!');
      } else {
        console.log('Usuário não é admin');
        toast.error('Você não tem permissão para acessar o painel administrativo');
        setIsAdmin(false);
        // Fazer logout do usuário que não é admin
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      toast.error('Erro ao verificar permissões. Tente novamente mais tarde.');
      setIsAdmin(false);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 