import { useState, useEffect } from 'react';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import EventsGrid from '@/components/home/EventsGrid';
import DateFilter from '@/components/home/DateFilter';
import { Event, Venue, eventsService, venuesService } from '@/services/supabase';
import EventCard from '@/components/home/EventCard';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/services/supabase';

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

interface EventWithVenue extends Event {
  venues?: Venue | null;
}

// Mock venue locations - TODO: Use real venue coordinates
const mockLocations = [
  { id: '1', name: 'Piano Bar', lat: -23.550520, lng: -46.633308, eventsCount: 3 },
  { id: '2', name: 'Comedia Club', lat: -23.546686, lng: -46.690913, eventsCount: 2 },
  { id: '3', name: 'Boteco Central', lat: -23.564812, lng: -46.702293, eventsCount: 4 },
  { id: '4', name: 'Bar do Canto', lat: -23.581403, lng: -46.683697, eventsCount: 1 },
  { id: '5', name: 'Rock Bar', lat: -23.587673, lng: -46.635605, eventsCount: 5 }
];

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [events, setEvents] = useState<EventWithVenue[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
    
    // Garantir que a data atual seja selecionada corretamente
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
    console.log('Data atual selecionada:', format(today, 'yyyy-MM-dd'));
  }, []);

  // Aplicar filtros sempre que os eventos, data selecionada, categoria ou busca mudar
  useEffect(() => {
    applyFilters();
  }, [events, selectedDate, selectedCategory, searchQuery]);

  const loadEvents = async () => {
    try {
      console.log('Iniciando carregamento de eventos na página Index');
      setLoading(true);
      
      const data = await eventsService.getEvents();
      
      console.log(`Recebidos ${data?.length || 0} eventos do serviço:`, data);
      
      if (!data || data.length === 0) {
        console.warn('Nenhum evento retornado do serviço');
        setEvents([]);
        setFilteredEvents([]);
        setLoading(false);
        return;
      }
      
      // Ordenar eventos por data
      const sortedEvents = [...data].sort((a, b) => {
        const dateA = parseISO(a.date);
        const dateB = parseISO(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      
      console.log('Eventos ordenados por data:', sortedEvents);
      
      setEvents(sortedEvents);
      setFilteredEvents(sortedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    console.log('Aplicando filtros:', {
      totalEvents: events.length,
      searchQuery,
      selectedCategory,
      selectedDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
    });

    if (!events || events.length === 0) {
      console.log('Nenhum evento para filtrar');
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];

    // Filtrar por data
    if (selectedDate) {
      console.log('Filtrando por data:', format(selectedDate, 'yyyy-MM-dd'));
      
      filtered = filtered.filter(event => {
        if (!event.date) {
          console.log(`Evento sem data: ${event.id} - ${event.title}`);
          return false;
        }
        
        try {
          const eventDate = parseISO(event.date);
          // Converter para string no formato yyyy-MM-dd para comparar apenas as datas
          const eventDateStr = format(eventDate, 'yyyy-MM-dd');
          const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
          
          const result = eventDateStr === selectedDateStr;
          console.log(`Comparando datas:
            Evento: ${event.title}
            Data do evento: ${eventDateStr}
            Data selecionada: ${selectedDateStr}
            Resultado: ${result}
          `);
          return result;
        } catch (error) {
          console.error('Erro ao comparar datas:', error, event);
          return false;
        }
      });
      
      console.log(`Após filtrar por data: ${filtered.length} eventos`);
    }

    // Filtrar por categoria
    if (selectedCategory) {
      console.log('Filtrando por categoria:', selectedCategory);
      
      if (selectedCategory === 'Eventos de Hoje') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(event => {
          if (!event.date) return false;
          try {
            const eventDate = parseISO(event.date);
            const result = isSameDay(eventDate, today);
            console.log(`Comparando com hoje - Evento: ${event.title}, Data: ${format(eventDate, 'yyyy-MM-dd')}, Resultado: ${result}`);
            return result;
          } catch (error) {
            console.error('Erro ao comparar datas:', error, event);
            return false;
          }
        });
      } else {
        filtered = filtered.filter(event => {
          const matches = event.category === selectedCategory;
          console.log(`Comparando categoria - Evento: ${event.title}, Categoria: ${event.category}, Selecionada: ${selectedCategory}, Resultado: ${matches}`);
          return matches;
        });
      }
      
      console.log(`Após filtrar por categoria: ${filtered.length} eventos`);
    }

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      console.log('Filtrando por busca:', query);
      
      filtered = filtered.filter(event => {
        const title = event.title?.toLowerCase() || '';
        const description = event.description?.toLowerCase() || '';
        const venueName = event.venues?.name?.toLowerCase() || '';
        const address = event.venues?.address?.toLowerCase() || '';
        
        const matches = (
          title.includes(query) || 
          description.includes(query) ||
          venueName.includes(query) ||
          address.includes(query)
        );
        
        console.log(`Comparando busca - Evento: ${event.title}, Resultado: ${matches}`);
        return matches;
      });
      
      console.log(`Após filtrar por busca: ${filtered.length} eventos`);
    }

    console.log(`Encontrados ${filtered.length} eventos após aplicar todos os filtros`);
    setFilteredEvents(filtered);
  };

  const handleSearch = (query: string) => {
    console.log('Busca:', query);
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    console.log('Categoria selecionada:', category);
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleDateSelect = (date: Date | null) => {
    console.log('Data selecionada:', date ? format(date, 'yyyy-MM-dd') : null);
    setSelectedDate(date);
  };

  const mapEventToEventData = (event: EventWithVenue): EventData => {
    // Verificar se o evento tem um ID
    if (!event.id) {
      console.warn('Evento sem ID:', event);
    }
    
    return {
      id: event.id || 'unknown',
      title: event.title || 'Evento sem título',
      date: event.date || '2023-01-01',
      time: event.time || '00:00',
      venueName: event.venues?.name || 'Local desconhecido',
      location: event.venues?.address || 'Endereço desconhecido',
      imageUrl: event.image_url || '/placeholder-event.jpg',
      category: event.category || 'Sem categoria'
    };
  };

  const displayEvents = filteredEvents.map(event => ({
    ...event,
    date: format(parseISO(event.date), 'dd/MM/yyyy', { locale: ptBR })
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <Hero onSearch={handleSearch} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        
        <div className="container mx-auto px-6 py-16 space-y-20">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
          />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Eventos do Dia</h2>
                <p className="text-muted-foreground">
                  {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Selecione uma data'}
                </p>
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Buscando por: "{searchQuery}"
                </p>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-[400px] bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
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
                    ? 'Nenhum evento encontrado para esta data.'
                    : searchQuery
                    ? `Nenhum evento encontrado para "${searchQuery}".`
                    : selectedCategory
                    ? `Nenhum evento encontrado na categoria "${selectedCategory}".`
                    : 'Nenhum evento cadastrado.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">EventosPira</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                A melhor plataforma para encontrar eventos em bares e restaurantes da sua cidade.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Início</Link></li>
                <li><Link to="/map" className="text-muted-foreground hover:text-foreground transition-colors">Mapa</Link></li>
                <li><Link to="/today" className="text-muted-foreground hover:text-foreground transition-colors">Hoje na Cidade</Link></li>
                <li><Link to="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">Meus Favoritos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Para Estabelecimentos</h4>
              <ul className="space-y-2">
                <li><Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">Painel de Controle</Link></li>
                <li><Link to="/register-venue" className="text-muted-foreground hover:text-foreground transition-colors">Cadastrar Local</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2023 EventosPira. Todos os direitos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
