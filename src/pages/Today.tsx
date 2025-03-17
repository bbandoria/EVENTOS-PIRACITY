import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, Venue, eventsService } from '@/services/supabase';
import EventCard from '@/components/home/EventCard';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import DateFilter from '@/components/home/DateFilter';

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

export default function Today() {
  const [events, setEvents] = useState<EventWithVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [allEvents, setAllEvents] = useState<EventWithVenue[]>([]);

  useEffect(() => {
    loadAllEvents();
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) {
      filterEventsByDate();
    }
  }, [selectedDate, allEvents]);

  const loadAllEvents = async () => {
    try {
      setLoading(true);
      const events = await eventsService.getAllEvents();
      setAllEvents(events as EventWithVenue[]);
      filterEventsByDate();
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const filterEventsByDate = () => {
    if (!selectedDate) {
      // Se não houver data selecionada, mostrar todos os eventos
      console.log(`Mostrando todos os ${allEvents.length} eventos`);
      setEvents(allEvents);
      return;
    }
    
    const filteredEvents = allEvents.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, selectedDate);
    });
    
    console.log(`Encontrados ${filteredEvents.length} eventos para ${format(selectedDate, 'dd/MM/yyyy')}`);
    setEvents(filteredEvents);
  };

  const handleDateSelect = (date: Date | null) => {
    console.log('Data selecionada:', date ? format(date, 'dd/MM/yyyy') : 'Todos os eventos');
    setSelectedDate(date);
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

  return (
    <>
      <Header />
      <div className="container py-8 pt-24">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {selectedDate 
                ? `Eventos do Dia ${format(selectedDate, "dd/MM", { locale: ptBR })}`
                : "Todos os Eventos"
              }
            </h1>
            <Link to="/map">
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Ver no Mapa
              </Button>
            </Link>
          </div>

          <DateFilter selectedDate={selectedDate} onDateSelect={handleDateSelect} />

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
                {selectedDate
                  ? `Não há eventos programados para ${format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}.`
                  : "Não há eventos cadastrados."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
