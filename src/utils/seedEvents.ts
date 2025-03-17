import { supabase } from '@/services/supabase';

// Função para criar eventos de teste
export async function seedEvents() {
  try {
    console.log('Iniciando criação de eventos de teste...');

    // Verificar se o usuário está autenticado
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      console.error('Usuário não autenticado');
      return { success: false, message: 'Você precisa estar autenticado para criar eventos de teste.' };
    }

    const ownerId = session.session.user.id;
    console.log('ID do usuário autenticado:', ownerId);

    // Primeiro, vamos criar alguns locais
    const venues = [
      {
        name: 'Bar do João',
        address: 'Rua das Flores, 123, Centro',
        description: 'Um bar tradicional com música ao vivo.',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        latitude: -22.7252,
        longitude: -47.6474,
        owner_id: ownerId
      },
      {
        name: 'Cervejaria Central',
        address: 'Av. Paulista, 1000, Bela Vista',
        description: 'Cervejaria artesanal com música ao vivo nos finais de semana.',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        latitude: -22.7352,
        longitude: -47.6574,
        owner_id: ownerId
      }
    ];

    console.log('Tentando criar locais...', venues);
    
    // Verificar se a tabela venues existe e se temos permissão
    const { error: tableCheckError } = await supabase
      .from('venues')
      .select('id')
      .limit(1);
      
    if (tableCheckError) {
      console.error('Erro ao verificar tabela venues:', tableCheckError);
      if (tableCheckError.code === 'PGRST301') {
        return { success: false, message: 'Você não tem permissão para acessar a tabela de locais.' };
      }
      return { success: false, message: `Erro ao verificar tabela venues: ${tableCheckError.message}` };
    }

    // Inserir os locais um por um para evitar problemas com restrições únicas
    let venuesData = [];
    for (const venue of venues) {
      // Verificar se o local já existe
      const { data: existingVenue, error: checkError } = await supabase
        .from('venues')
        .select('*')
        .eq('name', venue.name)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 significa que não encontrou resultados
        console.error('Erro ao verificar local existente:', checkError);
        continue;
      }

      if (existingVenue) {
        console.log(`Local "${venue.name}" já existe, atualizando...`);
        const { data: updatedVenue, error: updateError } = await supabase
          .from('venues')
          .update({ ...venue, id: existingVenue.id })
          .eq('id', existingVenue.id)
          .select();

        if (updateError) {
          console.error('Erro ao atualizar local:', updateError);
          continue;
        }

        if (updatedVenue) {
          venuesData.push(updatedVenue[0]);
        }
      } else {
        console.log(`Criando novo local "${venue.name}"...`);
        const { data: newVenue, error: insertError } = await supabase
          .from('venues')
          .insert(venue)
          .select();

        if (insertError) {
          console.error('Erro ao criar local:', insertError);
          continue;
        }

        if (newVenue) {
          venuesData.push(newVenue[0]);
        }
      }
    }

    if (venuesData.length === 0) {
      console.error('Nenhum local criado ou atualizado');
      return { success: false, message: 'Não foi possível criar ou atualizar os locais.' };
    }

    console.log('Locais criados/atualizados com sucesso:', venuesData);

    // Gerar datas para os próximos 7 dias
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }

    // Criar eventos para cada local
    const events = [];
    for (const venue of venuesData) {
      // Garantir que pelo menos um evento seja criado para hoje
      events.push({
        title: `Evento de Hoje em ${venue.name}`,
        description: `Este é um evento especial que acontece hoje em ${venue.name}`,
        date: dates[0], // O primeiro elemento do array dates é sempre a data atual
        time: '19:00',
        image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        venue_id: venue.id,
        category: 'Eventos de Hoje',
        owner_id: ownerId
      });
      
      // Criar eventos adicionais com datas aleatórias
      for (let i = 0; i < 2; i++) {
        events.push({
          title: `Evento ${i + 1} em ${venue.name}`,
          description: `Descrição do evento ${i + 1} em ${venue.name}`,
          date: dates[Math.floor(Math.random() * dates.length)],
          time: '19:00',
          image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
          venue_id: venue.id,
          category: ['Música ao Vivo', 'Stand-up Comedy', 'Happy Hour'][Math.floor(Math.random() * 3)],
          owner_id: ownerId
        });
      }
    }

    console.log('Tentando criar eventos:', events);

    // Inserir os eventos um por um
    let eventsData = [];
    for (const event of events) {
      console.log(`Tentando criar evento "${event.title}"...`);
      const { data: newEvent, error: insertError } = await supabase
        .from('events')
        .insert(event)
        .select();

      if (insertError) {
        console.error(`Erro ao criar evento "${event.title}":`, insertError);
        continue;
      }

      if (newEvent) {
        eventsData.push(newEvent[0]);
        console.log(`Evento "${event.title}" criado com sucesso`);
      }
    }

    if (eventsData.length === 0) {
      console.error('Nenhum evento foi criado');
      return { success: false, message: 'Não foi possível criar os eventos.' };
    }

    console.log(`${eventsData.length} eventos criados com sucesso:`, eventsData);
    return { success: true, message: `${eventsData.length} eventos criados com sucesso`, data: eventsData };
  } catch (error) {
    console.error('Erro ao criar eventos de teste:', error);
    return { success: false, message: `Erro ao criar eventos de teste: ${error instanceof Error ? error.message : String(error)}` };
  }
} 