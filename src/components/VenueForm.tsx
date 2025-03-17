import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { venuesService, supabase } from '@/services/supabase';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

export function VenueForm() {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    image_url: '',
    latitude: '',
    longitude: ''
  });

  // Função para buscar coordenadas do endereço
  const fetchCoordinates = async (address: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
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

  // Handler para mudança de endereço com debounce
  let debounceTimer: NodeJS.Timeout;
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, address: value }));

    // Limpar timer anterior
    clearTimeout(debounceTimer);

    // Configurar novo timer
    if (value.length > 5) {
      debounceTimer = setTimeout(() => {
        fetchCoordinates(value);
      }, 1000);
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
      const filePath = `venues/${fileName}`;

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
        await fetchCoordinates(formData.address);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Você precisa estar logado para cadastrar um local');
        return;
      }

      await venuesService.createVenue({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        owner_id: session.user.id
      });

      toast.success('Local cadastrado com sucesso!');
      setFormData({
        name: '',
        address: '',
        description: '',
        image_url: '',
        latitude: '',
        longitude: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar local:', error);
      toast.error('Erro ao cadastrar local');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Local</CardTitle>
        <CardDescription>
          Preencha os dados do local. Todos os campos marcados com * são obrigatórios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Local *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={handleAddressChange}
              required
              placeholder="Digite o endereço completo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                placeholder="Preenchido automaticamente"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                placeholder="Preenchido automaticamente"
                readOnly
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Local *</Label>
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
              'Salvar Local'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 