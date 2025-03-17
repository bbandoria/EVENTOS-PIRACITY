import { supabase } from '@/services/supabase';
import { format } from 'date-fns';

// Função para criar eventos para a data atual
export async function createEventsForToday() {
  try {
    console.log('Iniciando criação de eventos para hoje...');

    // Verificar se o usuário está autenticado
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.error('Usuário não autenticado');
      return { success: false, message: 'Você precisa estar autenticado para criar eventos.' };
    }

    const ownerId = session.session.user.id;
    console.log('ID do usuário autenticado:', ownerId);

    // Obter a data atual no formato ISO (YYYY-MM-DD)
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];
    console.log('Data atual (ISO):', todayIso);
    console.log('Data atual (formatada):', format(today, 'dd/MM/yyyy'));

    // Verificar se já existem eventos para hoje
    const { data: existingEvents, error: checkError } = await supabase
      .from('events')
      .select('id')
      .eq('date', todayIso);

    if (checkError) {
      console.error('Erro ao verificar eventos existentes:', checkError);
      return { success: false, message: `Erro ao verificar eventos existentes: ${checkError.message}` };
    }

    console.log(`Encontrados ${existingEvents?.length || 0} eventos existentes para hoje`);

    // Buscar locais existentes
    let { data: venuesData, error: venuesError } = await supabase
      .from('venues')
      .select('*');

    if (venuesError) {
      console.error('Erro ao buscar locais:', venuesError);
      return { success: false, message: `Erro ao buscar locais: ${venuesError.message}` };
    }

    if (!venuesData || venuesData.length === 0) {
      console.log('Nenhum local encontrado. Criando locais padrão...');
      
      // Criar locais padrão
      const defaultVenues = [
        {
          name: 'Bar do Centro',
          address: 'Rua Central, 123, Centro',
          description: 'Um bar aconchegante no centro da cidade.',
          image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
          latitude: -22.7252,
          longitude: -47.6474,
          owner_id: ownerId
        },
        {
          name: 'Pub da Esquina',
          address: 'Av. Principal, 500, Jardim',
          description: 'Pub com música ao vivo e petiscos.',
          image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
          latitude: -22.7352,
          longitude: -47.6574,
          owner_id: ownerId
        }
      ];

      const { data: createdVenues, error: createVenuesError } = await supabase
        .from('venues')
        .upsert(defaultVenues)
        .select();

      if (createVenuesError) {
        console.error('Erro ao criar locais padrão:', createVenuesError);
        return { success: false, message: `Erro ao criar locais padrão: ${createVenuesError.message}` };
      }

      console.log('Locais padrão criados com sucesso:', createdVenues);
      
      // Usar os locais recém-criados
      venuesData = createdVenues;
    }

    // Criar eventos para hoje
    const events = [];
    const categories = ['Música ao Vivo', 'Stand-up Comedy', 'Happy Hour', 'Eventos de Hoje'];
    const timeSlots = ['12:00', '15:00', '18:00', '19:30', '21:00'];

    for (const venue of venuesData) {
      // Criar 2 eventos para cada local
      for (let i = 0; i < 2; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        events.push({
          title: `Evento de Hoje: ${category} em ${venue.name}`,
          description: `Um evento especial de ${category.toLowerCase()} que acontece hoje em ${venue.name}. Não perca!`,
          date: todayIso,
          time: timeSlot,
          image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
          venue_id: venue.id,
          category: category,
          owner_id: ownerId
        });
      }
    }

    console.log(`Tentando criar ${events.length} eventos para hoje:`, events);

    // Inserir os eventos
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .upsert(events)
      .select();

    if (eventsError) {
      console.error('Erro ao criar eventos para hoje:', eventsError);
      return { success: false, message: `Erro ao criar eventos para hoje: ${eventsError.message}` };
    }

    console.log('Eventos para hoje criados com sucesso:', eventsData);
    return { 
      success: true, 
      message: `${eventsData.length} eventos criados para hoje (${format(today, 'dd/MM/yyyy')})`, 
      data: eventsData 
    };
  } catch (error) {
    console.error('Erro ao criar eventos para hoje:', error);
    return { 
      success: false, 
      message: `Erro ao criar eventos para hoje: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
} 