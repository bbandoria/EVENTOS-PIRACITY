import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Event } from '@/types/event';
import { Venue } from '@/services/storage';

interface EventListProps {
  events: Event[];
  venues: Venue[];
  onDelete: (id: string) => void;
}

export function EventList({ events, venues, onDelete }: EventListProps) {
  const getVenueName = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    return venue ? venue.name : 'Local não encontrado';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Eventos Cadastrados</h2>
      {events.length === 0 ? (
        <p className="text-muted-foreground">Nenhum evento cadastrado.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <strong>Data:</strong>{' '}
                        {format(event.date, "PPP 'às' HH:mm", { locale: ptBR })}
                      </p>
                      <p className="text-sm">
                        <strong>Local:</strong> {getVenueName(event.venue)}
                      </p>
                      <p className="text-sm">
                        <strong>Categoria:</strong> {event.category}
                      </p>
                      <p className="text-sm">
                        <strong>Preço:</strong> {event.price}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 