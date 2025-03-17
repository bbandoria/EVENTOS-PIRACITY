import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import EventCard from '@/components/home/EventCard';

export function DirectEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Carregando eventos diretamente do Supabase...');
      
      const { data, error } = await supabase
        .from('events')
        .select('*, venues(*)');
      
      if (error) {
        console.error('Erro ao carregar eventos:', error);
        setError(error.message);
        toast.error('Erro ao carregar eventos');
        return;
      }
      
      console.log(`Carregados ${data?.length || 0} eventos diretamente do Supabase`);
      setEvents(data || []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError(String(err));
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const mapEventToEventData = (event: any) => ({
    id: event.id || 'unknown',
    title: event.title || 'Evento sem título',
    date: event.date || '2023-01-01',
    time: event.time || '00:00',
    venueName: event.venues?.name || 'Local desconhecido',
    location: event.venues?.address || 'Endereço desconhecido',
    imageUrl: event.image_url || '/placeholder-event.jpg',
    category: event.category || 'Sem categoria'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Eventos Diretos</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadEvents}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Recarregar'}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Erro ao carregar eventos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={mapEventToEventData(event)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Nenhum evento encontrado diretamente no Supabase.
          </p>
        </div>
      )}
    </div>
  );
} 