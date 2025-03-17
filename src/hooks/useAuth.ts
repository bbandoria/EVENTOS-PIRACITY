import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { User, AuthError } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Inicializando autenticação...');
        setLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError.message);
          setLoading(false);
          return;
        }

        if (session) {
          console.log('Sessão encontrada:', session.user.email);
          setUser(session.user);
        } else {
          console.log('Nenhuma sessão ativa - usuário não logado');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setUser(null);
      } finally {
        console.log('Autenticação inicializada, loading definido como false');
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Mudança de estado de autenticação:', event, session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login para:', email);
      
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de autenticação:', error.message);
        if (error instanceof AuthError) {
          switch (error.message) {
            case 'Invalid login credentials':
              throw new Error('Email ou senha incorretos');
            case 'Invalid API key':
              console.error('Erro com a chave da API do Supabase');
              throw new Error('Erro de configuração do servidor. Por favor, contate o administrador.');
            default:
              throw new Error(`Erro de autenticação: ${error.message}`);
          }
        }
        throw error;
      }

      console.log('Login realizado com sucesso para:', data.user?.email);
      return data;
    } catch (error) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Tentando criar conta com:', { email });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Erro ao criar conta:', error);
        throw error;
      }

      console.log('Conta criada com sucesso:', data);
      return data;
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
} 