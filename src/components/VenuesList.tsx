import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import { venuesService } from '@/services/supabase';
import { toast } from 'sonner';
import type { VenueType } from '@/types/venue';

export function VenuesList() {
  const [venues, setVenues] = useState<VenueType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      const data = await venuesService.getAllVenues();
      setVenues(data);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
      toast.error('Erro ao carregar locais');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venue: VenueType) => {
    // Implementar edição
    console.log('Editar local:', venue);
  };

  const handleDelete = async (venue: VenueType) => {
    if (!confirm('Tem certeza que deseja excluir este local?')) return;

    try {
      await venuesService.deleteVenue(venue.id);
      toast.success('Local excluído com sucesso!');
      loadVenues(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir local:', error);
      toast.error('Erro ao excluir local');
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Locais</CardTitle>
        <CardDescription>
          Gerencie os locais cadastrados por você
        </CardDescription>
      </CardHeader>
      <CardContent>
        {venues.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum local cadastrado ainda.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>{venue.address}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(venue)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(venue)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 