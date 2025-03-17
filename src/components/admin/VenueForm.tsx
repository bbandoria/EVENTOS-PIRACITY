import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { MapPin, Loader2 } from 'lucide-react';
import { Venue } from '@/services/supabase';
import { getCoordinatesFromAddress } from '@/utils/geocoding';

interface VenueFormProps {
  venue?: Venue;
  onSubmit: (venue: Venue) => void;
  onCancel: () => void;
}

export function VenueForm({ venue, onSubmit, onCancel }: VenueFormProps) {
  const [name, setName] = useState(venue?.name || '');
  const [address, setAddress] = useState(venue?.address || '');
  const [description, setDescription] = useState(venue?.description || '');
  const [image_url, setImageUrl] = useState(venue?.image_url || '');
  const [latitude, setLatitude] = useState(venue?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(venue?.longitude?.toString() || '');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Função para obter coordenadas do endereço
  const getLocationFromAddress = async () => {
    if (!address) return;
    
    setIsLoadingLocation(true);
    try {
      const coordinates = await getCoordinatesFromAddress(address);
      if (coordinates) {
        setLatitude(coordinates.lat.toString());
        setLongitude(coordinates.lng.toString());
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Obter coordenadas quando o endereço for alterado
  useEffect(() => {
    const timer = setTimeout(() => {
      getLocationFromAddress();
    }, 1000); // Aguarda 1 segundo após a última alteração do endereço

    return () => clearTimeout(timer);
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !description || !latitude || !longitude) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const venueData: Omit<Venue, 'id' | 'created_at'> = {
      name,
      address,
      description,
      image_url: image_url || '/placeholder-venue.jpg',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    onSubmit(venue ? { ...venueData, id: venue.id } : venueData as Venue);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Estabelecimento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do estabelecimento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Digite o endereço completo"
                required
              />
              {isLoadingLocation && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mt-3" />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Localização</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Latitude"
                  required
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Longitude"
                  required
                />
              </div>
            </div>
          </div>

          <ImageUpload
            value={image_url}
            onChange={setImageUrl}
            label="Imagem do Estabelecimento"
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {venue ? 'Salvar Alterações' : 'Cadastrar Local'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 