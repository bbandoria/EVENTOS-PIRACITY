import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Venue, Event, venuesService, eventsService } from '@/services/supabase';
import { VenueMap } from '@/components/home/VenueMap';
import { Search, SlidersHorizontal, MapPin, Heart, Calendar, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { calculateDistance } from '@/utils/distance';
import { toast } from '@/components/ui/use-toast';

interface VenueWithDistance extends Venue {
  eventsCount: number;
  distance?: number;
}

export default function Map() {
  const [venues, setVenues] = useState<VenueWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Erro de Localização",
        description: "Geolocalização não é suportada pelo seu navegador",
        variant: "destructive"
      });
      return;
    }

    // Verifica se está em HTTPS
    if (window.location.protocol !== 'https:') {
      toast({
        title: "Aviso de Segurança",
        description: "A geolocalização requer uma conexão segura (HTTPS). Usando localização padrão de Piracicaba.",
        variant: "default"
      });
      setUserLocation({ lat: -22.7250, lng: -47.6476 }); // Coordenadas de Piracicaba
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);

        // Adiciona a distância aos locais
        const venuesWithDistance = venues.map(venue => ({
          ...venue,
          distance: calculateDistance(
            location.lat,
            location.lng,
            venue.latitude,
            venue.longitude
          )
        }));

        setVenues(venuesWithDistance);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast({
          title: "Erro de Localização",
          description: "Não foi possível obter sua localização. Usando localização padrão de Piracicaba.",
          variant: "default"
        });
        setUserLocation({ lat: -22.7250, lng: -47.6476 }); // Coordenadas de Piracicaba
      }
    );
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [venuesData, eventsData] = await Promise.all([
        venuesService.getAllVenues(),
        eventsService.getAllEvents()
      ]);

      // Conta eventos por local
      const eventsCount = eventsData.reduce((acc, event) => {
        acc[event.venue_id] = (acc[event.venue_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Adiciona contagem de eventos aos locais
      const venuesWithEvents = venuesData.map(venue => ({
        ...venue,
        eventsCount: eventsCount[venue.id!] || 0
      }));

      setVenues(venuesWithEvents);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os locais e eventos.',
        variant: 'default'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    venue.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openInGoogleMaps = (venue: VenueWithDistance) => {
    if (!venue.latitude || !venue.longitude) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.latitude},${venue.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-semibold hover:opacity-80">
              Eventos Pira
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-muted-foreground">
                  Explorar
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="default" className="bg-zinc-900">
                  <MapPin className="h-4 w-4 mr-2" />
                  Mapa
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="ghost" className="text-muted-foreground">
                  <Heart className="h-4 w-4 mr-2" />
                  Favoritos
                </Button>
              </Link>
            </nav>
          </div>
          <Link to="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex">
        {/* Lista de Estabelecimentos e Mapa */}
        <div className="flex flex-1 h-[calc(100vh-64px)]">
          {/* Lista de Estabelecimentos */}
          <div className="w-[400px] bg-white overflow-auto border-r">
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-2">Mapa de Bares e Eventos</h1>
              <p className="text-muted-foreground mb-6">Encontre estabelecimentos próximos a você</p>
              
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por bares, restaurantes..."
                  className="pl-9 pr-12"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8"
                  title="Filtros"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {userLocation && (
                <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>Sua localização atual</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mostrando estabelecimentos próximos a você. Os resultados estão ordenados por distância.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Estabelecimentos</h2>
                  <span className="text-sm text-muted-foreground">
                    {filteredVenues.length} {filteredVenues.length === 1 ? 'local encontrado' : 'locais encontrados'}
                  </span>
                </div>

                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-muted-foreground">Carregando estabelecimentos...</p>
                    </div>
                  ) : filteredVenues.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum estabelecimento encontrado</p>
                    </div>
                  ) : (
                    filteredVenues.map(venue => (
                      <div 
                        key={venue.id} 
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer group transition-colors"
                        onClick={() => openInGoogleMaps(venue)}
                      >
                        <img
                          src={venue.image_url || '/placeholder-venue.jpg'}
                          alt={venue.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium truncate">{venue.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{venue.address}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Abrir no Google Maps"
                            >
                              <Navigation className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {venue.eventsCount} {venue.eventsCount === 1 ? 'evento' : 'eventos'}
                            </span>
                            {userLocation && venue.distance !== undefined && (
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {venue.distance.toFixed(1)} km
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {filteredVenues.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                  >
                    <img src="/google-maps-icon.png" alt="Google Maps" className="h-4 w-4" />
                    Abrir Google Maps
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mapa */}
          <div className="flex-1 relative">
            <VenueMap
              venues={filteredVenues}
              userLocation={userLocation}
              onVenueClick={openInGoogleMaps}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
