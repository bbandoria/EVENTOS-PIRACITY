import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, eventsService, venuesService } from '@/services/supabase';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';
import type { VenueType } from '@/types/venue';
import type { EventType } from '@/types/event';

export function EventForm() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image_url: '',
    venue_id: '',
    category: '',
    latitude: '',
    longitude: ''
  });

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const venues = await venuesService.getAllVenues();
      setVenues(venues);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      toast.error('Erro ao carregar locais');
    }
  };

  // Função para buscar coordenadas do endereço selecionado
  const fetchCoordinates = async (venueId: string) => {
    try {
      const selectedVenue = venues.find(venue => venue.id === venueId);
      if (!selectedVenue?.address) return;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(selectedVenue.address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
        toast.success('Coordenadas encontradas!');
      } else {
        toast.error('Não foi possível encontrar as coordenadas para este endereço');
      }
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      toast.error('Erro ao buscar coordenadas');
    }
  };

  // Handler para upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingImage(true);

      // Verificar o tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      // Verificar o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('O arquivo deve ser uma imagem');
        return;
      }

      // Gerar um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      // Fazer upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Obter a URL pública da imagem
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Verificar se temos as coordenadas
      if (!formData.latitude || !formData.longitude) {
        await fetchCoordinates(formData.venue_id);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Você precisa estar logado para cadastrar um evento');
        return;
      }

      await eventsService.createEvent({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        owner_id: session.user.id
      });

      toast.success('Evento cadastrado com sucesso!');
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        image_url: '',
        venue_id: '',
        category: '',
        latitude: '',
        longitude: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar evento:', error);
      toast.error('Erro ao cadastrar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleVenueChange = (value: string) => {
    setFormData(prev => ({ ...prev, venue_id: value }));
    fetchCoordinates(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Evento</CardTitle>
        <CardDescription>
          Preencha os dados do evento. Todos os campos marcados com * são obrigatórios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Local *</Label>
            <Select value={formData.venue_id} onValueChange={handleVenueChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um local" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude}
                placeholder="Preenchido automaticamente"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude}
                placeholder="Preenchido automaticamente"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="show">Show</SelectItem>
                <SelectItem value="teatro">Teatro</SelectItem>
                <SelectItem value="standup">Stand Up</SelectItem>
                <SelectItem value="exposicao">Exposição</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Evento *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image')?.click()}
                disabled={uploadingImage}
                className="w-full"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Escolher Imagem
                  </>
                )}
              </Button>
              {formData.image_url && (
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="h-10 w-10 object-cover rounded"
                />
              )}
            </div>
            {formData.image_url && (
              <p className="text-sm text-muted-foreground mt-2">
                Imagem selecionada com sucesso!
              </p>
            )}
          </div>

          <Button type="submit" disabled={loading || uploadingImage} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Evento'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 