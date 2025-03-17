import { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { Event, Venue, eventsService } from '@/services/supabase';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface EventFormProps {
  venues: Venue[];
  event?: Event;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
}

export function EventForm({ venues, event, onSubmit, onCancel }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [date, setDate] = useState(event?.date || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(event?.time?.slice(0, 5) || '');
  const [venue_id, setVenueId] = useState(event?.venue_id || '');
  const [image_url, setImageUrl] = useState(event?.image_url || '');
  const [category, setCategory] = useState(event?.category || '');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!title || !date || !time || !venue_id || !category) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      // Garante que a data está no formato correto YYYY-MM-DD
      const formattedDate = format(parseISO(date), 'yyyy-MM-dd');

      const eventData = {
        title: title.trim(),
        description: description.trim() || '',
        date: formattedDate,
        time: time + ':00',
        venue_id: venue_id,
        image_url: image_url || '/placeholder-event.jpg',
        category: category,
        owner_id: event?.owner_id || ''
      };

      console.log('Enviando dados do evento:', eventData);
      
      // Chama a função de callback apenas uma vez
      onSubmit(eventData as Event);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      toast.error('Erro ao processar formulário.');
    } finally {
      setLoading(false);
    }
  }, [title, description, date, time, venue_id, image_url, category, loading, event?.owner_id, onSubmit]);

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Evento *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Local *</Label>
            <Select value={venue_id} onValueChange={setVenueId} required>
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

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Música ao Vivo">Música ao Vivo</SelectItem>
                <SelectItem value="Stand-up Comedy">Stand-up Comedy</SelectItem>
                <SelectItem value="Happy Hour">Happy Hour</SelectItem>
                <SelectItem value="Karaokê">Karaokê</SelectItem>
                <SelectItem value="Sertanejo">Sertanejo</SelectItem>
                <SelectItem value="Rock">Rock</SelectItem>
                <SelectItem value="MPB">MPB</SelectItem>
                <SelectItem value="Pagode">Pagode</SelectItem>
                <SelectItem value="Samba">Samba</SelectItem>
                <SelectItem value="Forró">Forró</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Evento</Label>
            <ImageUpload
              value={image_url}
              onChange={setImageUrl}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : event?.id ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 