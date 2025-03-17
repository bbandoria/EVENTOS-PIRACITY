import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, Venue, eventsService, favoritesService } from '@/services/supabase';
import EventCard from '@/components/home/EventCard';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useAuthContext } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';

interface EventWithVenue extends Event {
  venues: Venue;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  location: string;
  imageUrl: string;
  category: string;
}

export default function Favorites() {
  const { user } = useAuthContext();
  const [events, setEvents] = useState<EventWithVenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = await favoritesService.getFavorites(user!.id);
      const favoriteEvents = await Promise.all(
        favoriteIds.map(id => eventsService.getEventById(id))
      );
      setEvents(favoriteEvents.filter(Boolean) as EventWithVenue[]);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const mapEventToEventData = (event: EventWithVenue): EventData => ({
    id: event.id!,
    title: event.title,
    date: event.date,
    time: event.time,
    venueName: event.venues?.name || '',
    location: event.venues?.address || '',
    imageUrl: event.image_url,
    category: event.category
  });

  if (!user) {
    return (
      <>
        <Header />
        <div className="container py-8 pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Favoritos</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Faça login para ver seus eventos favoritos
            </p>
            <Link to="/login">
              <Button>Entrar</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8 pt-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Meus Favoritos</h1>
            <Link to="/map">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Ver no Mapa
              </Button>
            </Link>
          </div>

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
                Você ainda não tem eventos favoritos.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
