import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Share2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/providers/AuthProvider';
import { favoritesService } from '@/services/supabase';
import { toast } from 'sonner';

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  venueName: string;
  location: string;
  imageUrl: string;
  category: string;
}

interface EventCardProps {
  event: EventData;
  variant?: 'default' | 'featured';
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuthContext();

  // Adicionar log para depuração
  useEffect(() => {
    console.log('EventCard renderizado:', { event, user: user ? 'logado' : 'não logado' });
  }, [event, user]);

  useEffect(() => {
    // Verifica se o evento é favorito quando o usuário está logado
    if (user) {
      favoritesService.isFavorite(user.id, event.id)
        .then(setIsFavorite)
        .catch(console.error);
    }
  }, [user, event.id]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o modal de abrir

    if (!user) {
      toast.error('Faça login para favoritar eventos');
      return;
    }

    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(user.id, event.id);
        toast.success('Evento removido dos favoritos');
      } else {
        await favoritesService.addFavorite(user.id, event.id);
        toast.success('Evento adicionado aos favoritos');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erro ao gerenciar favorito:', error);
      toast.error('Erro ao gerenciar favorito');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: `${event.title} em ${event.venueName}`,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${event.venueName} ${event.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <>
      <Card 
        className="overflow-hidden group h-full cursor-pointer transition-transform hover:scale-[1.02]"
        onClick={() => setIsModalOpen(true)}
      >
        <div className={cn(
          "relative overflow-hidden",
          variant === 'featured' ? 'h-48' : 'h-40'
        )}>
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold mb-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-white/80 text-sm">
              {event.date} às {event.time}
            </p>
          </div>
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </div>
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 bg-background/50 hover:bg-background/70 backdrop-blur-sm"
              onClick={handleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current text-red-500")} />
            </Button>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">{event.venueName}</p>
            <p className="text-sm text-muted-foreground">{event.location}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogDescription className="text-base text-foreground">
              {event.category}
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Local</h4>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p className="font-medium">{event.venueName}</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
            <div className="flex gap-2">
              {user && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                >
                  <Heart className={cn("h-4 w-4", isFavorite && "fill-current text-red-500")} />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={openGoogleMaps}>
              <MapPin className="h-4 w-4 mr-2" />
              Ver no Mapa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
