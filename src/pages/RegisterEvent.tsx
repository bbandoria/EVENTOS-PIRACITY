import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { eventsService, Event } from '@/services/supabase';
import { venuesService } from '@/services/supabase';
import { useAuthContext } from '@/providers/AuthProvider';
import { format } from 'date-fns';

type EventFormData = Omit<Event, 'id' | 'created_at'>;

export default function RegisterEvent() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState<any[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:00',
    image_url: '',
    venue_id: '',
    category: 'show',
    owner_id: user?.id || ''
  });

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const data = await venuesService.getVenues();
        setVenues(data);
      } catch (error) {
        console.error('Error loading venues:', error);
        toast.error('Erro ao carregar locais');
      }
    };

    loadVenues();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await eventsService.createEvent(formData);
      toast.success('Evento cadastrado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Erro ao cadastrar evento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Evento</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Nome do Evento
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o nome do evento"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o evento"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Data
            </label>
            <Input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              min={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Horário
            </label>
            <Input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="venue" className="text-sm font-medium">
              Local
            </label>
            <select
              id="venue"
              value={formData.venue_id}
              onChange={(e) => setFormData(prev => ({ ...prev, venue_id: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Selecione um local</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              required
            >
              <option value="show">Show</option>
              <option value="teatro">Teatro</option>
              <option value="exposicao">Exposição</option>
              <option value="feira">Feira</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Imagem do Evento
            </label>
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 