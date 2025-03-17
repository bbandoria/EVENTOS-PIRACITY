import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ImageIcon } from 'lucide-react';
import { Venue } from '@/services/supabase';
import { Skeleton } from '@/components/ui/skeleton';

interface VenueListProps {
  venues: Venue[];
  isLoading?: boolean;
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

export function VenueList({ venues, isLoading, onEdit, onDelete }: VenueListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum local cadastrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {venues.map((venue) => (
        <Card key={venue.id}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                {venue.image_url ? (
                  <img
                    src={venue.image_url}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="text-sm text-muted-foreground">{venue.address}</p>
              </div>
              <p className="text-sm text-muted-foreground">{venue.description}</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(venue)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir este local?')) {
                      onDelete(venue.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 