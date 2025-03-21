import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VenueForm } from '@/components/VenueForm';
import { EventForm } from '@/components/EventForm';
import { VenuesList } from '@/components/VenuesList';
import { EventsList } from '@/components/EventsList';
import { Button } from '@/components/ui/button';
import { LogOut, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserEmail(session.user.email || '');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logout realizado com sucesso!');
      window.location.href = 'https://eventospira.netlify.app/login';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Painel de Controle</h1>
          <p className="text-muted-foreground">
            Gerencie eventos e locais do sistema
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Home
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="venues" className="space-y-8">
        <TabsList>
          <TabsTrigger value="venues">Locais</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="venues" className="space-y-8">
          <VenuesList />
          <VenueForm />
        </TabsContent>

        <TabsContent value="events" className="space-y-8">
          <EventsList />
          <EventForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
