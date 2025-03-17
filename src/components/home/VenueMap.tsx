/// <reference types="@types/google.maps" />
import { useEffect, useRef, useState } from 'react';
import { Venue } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';

interface VenueWithDistance extends Venue {
  eventsCount: number;
  distance?: number;
}

interface VenueMapProps {
  venues: VenueWithDistance[];
  userLocation: { lat: number; lng: number } | null;
  onVenueClick: (venue: VenueWithDistance) => void;
}

export function VenueMap({ venues, userLocation, onVenueClick }: VenueMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verifica se o elemento do mapa existe
        if (!mapContainerRef.current) {
          throw new Error('Elemento do mapa não encontrado');
        }

        // Verifica se a API do Google Maps está disponível
        if (!window.google?.maps) {
          throw new Error('Google Maps não foi carregado corretamente');
        }

        // Importa as bibliotecas necessárias
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

        // Inicializa o mapa se ainda não existir
        if (!mapRef.current) {
          const defaultCenter = { lat: -22.7250, lng: -47.6476 }; // Piracicaba
          
          mapRef.current = new Map(mapContainerRef.current, {
            center: userLocation || defaultCenter,
            zoom: 13,
            mapId: 'eventos-pira-map',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });
        }

        // Limpa marcadores antigos
        markersRef.current.forEach(marker => marker.map = null);
        markersRef.current = [];

        // Adiciona marcador do usuário
        if (userLocation) {
          const userPin = new PinElement({
            background: '#4F46E5',
            borderColor: '#ffffff',
            glyphColor: '#ffffff',
            scale: 1.2
          });

          const userMarker = new AdvancedMarkerElement({
            map: mapRef.current,
            position: userLocation,
            title: 'Sua localização',
            content: userPin.element
          });

          markersRef.current.push(userMarker);
        }

        // Adiciona marcadores dos locais
        venues.forEach(venue => {
          if (!venue.latitude || !venue.longitude) return;

          const venuePin = new PinElement({
            background: '#EF4444',
            borderColor: '#ffffff',
            glyphColor: '#ffffff',
            scale: 1.1
          });

          const marker = new AdvancedMarkerElement({
            map: mapRef.current,
            position: { lat: venue.latitude, lng: venue.longitude },
            title: venue.name,
            content: venuePin.element
          });

          marker.addListener('click', () => onVenueClick(venue));
          markersRef.current.push(marker);
        });

        // Ajusta o zoom para mostrar todos os marcadores
        if (venues.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          
          if (userLocation) {
            bounds.extend(userLocation);
          }
          
          venues.forEach(venue => {
            if (venue.latitude && venue.longitude) {
              bounds.extend({ lat: venue.latitude, lng: venue.longitude });
            }
          });

          mapRef.current.fitBounds(bounds);
          mapRef.current.setZoom((mapRef.current.getZoom() || 13) - 1);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro ao inicializar o mapa:', error);
        setError('Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.');
        toast({
          title: "Erro ao carregar o mapa",
          description: error instanceof Error ? error.message : 'Erro desconhecido',
          variant: "destructive"
        });
      }
    };

    initMap();
  }, [venues, userLocation, onVenueClick]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
        <div className="text-center p-4">
          <p className="text-zinc-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="absolute inset-0" />;
}
