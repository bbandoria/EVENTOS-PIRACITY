
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, Heart, ChevronLeft, Star, Ticket } from 'lucide-react';
import Header from '../components/layout/Header';
import { Button } from '@/components/ui/button';
import { EventData } from '../components/home/EventCard';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data - in a real application, this would come from an API
const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'Show de Jazz ao Vivo',
    date: '22 Jun 2023',
    time: '21:00',
    venueName: 'Piano Bar',
    location: 'Centro',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Música ao Vivo',
    isFeatured: true
  },
  // More events here
];

// Extended event details for the mock
interface ExtendedEventDetails extends EventData {
  description: string;
  ticketPrice?: string;
  address: string;
  artists: string[];
  venueImageUrl: string;
}

const mockEventDetails: Record<string, ExtendedEventDetails> = {
  '1': {
    ...mockEvents[0],
    description: "Uma noite incrível com os melhores músicos de jazz da cidade. Venha curtir um ambiente sofisticado com boa música e drinks especiais. Neste evento, nosso quarteto de jazz tocará os clássicos do gênero, perfeito para os amantes de jazz e para quem quer conhecer mais sobre esse estilo musical.",
    ticketPrice: "R$30",
    address: "Rua dos Músicos, 123 - Centro",
    artists: ["Quarteto Jazz Brasil", "Fernanda Souza (vocal)", "Ricardo Lima (piano)"],
    venueImageUrl: "https://images.unsplash.com/photo-1508028209469-933de69c0f1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  },
  // More detailed events here
};

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<ExtendedEventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate loading data from API
    const timer = setTimeout(() => {
      if (id && mockEventDetails[id]) {
        setEvent(mockEventDetails[id]);
      }
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: !isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
      description: event ? (!isFavorite ? `${event.title} foi salvo nos seus favoritos` : `${event.title} foi removido dos favoritos`) : "",
      duration: 3000,
    });
  };
  
  const handleShare = () => {
    // In a real app, this would use the Web Share API
    toast({
      title: "Link copiado!",
      description: "O link do evento foi copiado para a área de transferência.",
      duration: 3000,
    });
  };
  
  const handleTicketPurchase = () => {
    // In a real app, this would navigate to ticket purchase or reservation flow
    toast({
      title: "Compra de ingresso",
      description: "Em uma aplicação real, isso levaria à página de compra de ingressos.",
      duration: 3000,
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-32 pb-16">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
            <div className="h-40 bg-muted rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-32 bg-muted rounded mt-6"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-muted rounded-2xl"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Evento não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 pt-32 pb-16">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            className="gap-1 text-muted-foreground"
          >
            <Link to="/">
              <ChevronLeft size={16} />
              Voltar
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {event.category}
          </span>
          {event.ticketPrice && (
            <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
              {event.ticketPrice}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-muted-foreground text-sm mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="flex-shrink-0" />
                <span>{event.venueName} - {event.location}</span>
              </div>
            </div>
            
            <div className="relative w-full h-0 pb-[56.25%] mb-8 overflow-hidden rounded-2xl">
              <img 
                src={event.imageUrl} 
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Sobre o evento</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="rounded-full"
                  aria-label="Compartilhar"
                >
                  <Share2 size={18} />
                </Button>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="icon"
                  onClick={toggleFavorite}
                  className={cn(
                    "rounded-full",
                    isFavorite && "bg-primary text-primary-foreground"
                  )}
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                </Button>
              </div>
            </div>
            
            <div className="prose prose-sm max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
            
            {event.artists.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Atrações</h3>
                <ul className="space-y-2">
                  {event.artists.map((artist, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star size={16} className="text-primary" />
                      <span>{artist}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="aspect-w-4 aspect-h-3 relative overflow-hidden">
                <img 
                  src={event.venueImageUrl} 
                  alt={event.venueName}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="font-semibold text-white">{event.venueName}</h3>
                  <p className="text-sm text-white/80">{event.address}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Local do Evento</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.address}</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to={`/venues/${event.venueName.toLowerCase().replace(/\s+/g, '-')}`}>
                    Ver detalhes do local
                  </Link>
                </Button>
              </div>
            </div>
            
            {event.ticketPrice && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-medium mb-4">Ingressos</h3>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Preço</p>
                  <p className="text-2xl font-semibold">{event.ticketPrice}</p>
                </div>
                <Button className="w-full gap-2" onClick={handleTicketPurchase}>
                  <Ticket size={18} />
                  Comprar Ingresso
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
