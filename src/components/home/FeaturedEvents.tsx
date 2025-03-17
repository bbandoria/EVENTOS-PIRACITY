import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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

interface FeaturedEventsProps {
  events: EventData[];
}

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  if (events.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Eventos em Destaque</h2>
        <p className="text-muted-foreground">Os melhores eventos da cidade</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
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
            </div>
            <CardContent className="p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{event.venueName}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
