import { createClient } from '@supabase/supabase-js';
import type { EventType } from '@/types/event';
import type { VenueType } from '@/types/venue';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton para o cliente Supabase
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL não está definida no arquivo .env');
    }

    if (!supabaseKey) {
      throw new Error('VITE_SUPABASE_ANON_KEY não está definida no arquivo .env');
    }

    console.log('Inicializando cliente Supabase com:', {
      url: supabaseUrl,
      keyLength: supabaseKey.length,
    });

    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

// Interfaces
export interface Favorite {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface Venue {
  id?: string;
  name: string;
  address: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
  owner_id: string;
  created_at?: string;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image_url: string;
  venue_id: string;
  category: string;
  owner_id: string;
  created_at?: string;
}

// Serviços
export const favoritesService = {
  async addFavorite(userId: string, eventId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, event_id: eventId }])
      .select();

    if (error) throw error;
  },

  async removeFavorite(userId: string, eventId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) throw error;
  },

  async getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('event_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(fav => fav.event_id) || [];
  },

  async isFavorite(userId: string, eventId: string): Promise<boolean> {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('event_id', eventId);

    if (error) throw error;
    return count ? count > 0 : false;
  }
};

export const venuesService = {
  async createVenue(venue: Omit<VenueType, 'id' | 'created_at'>): Promise<VenueType> {
    const { data, error } = await supabase
      .from('venues')
      .insert([venue])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getVenues(): Promise<VenueType[]> {
    // Obter o usuário atual
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      console.warn('Usuário não autenticado ao tentar buscar locais');
      return [];
    }
    
    // Buscar apenas os locais do usuário atual
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('owner_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar locais do usuário:', error);
      throw error;
    }
    
    console.log(`Encontrados ${data.length} locais para o usuário ${userData.user.email}`);
    return data;
  },

  async getAllVenues(): Promise<VenueType[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getVenueById(id: string): Promise<VenueType | null> {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateVenue(id: string, venue: Omit<VenueType, 'id' | 'created_at' | 'owner_id'>): Promise<VenueType> {
    // Obter o usuário atual
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    
    if (!userData.user) {
      throw new Error('Usuário não autenticado ao tentar atualizar local');
    }
    
    // Verificar se o local pertence ao usuário atual
    const { data: venueData, error: venueError } = await supabase
      .from('venues')
      .select('owner_id')
      .eq('id', id)
      .single();
      
    if (venueError) {
      console.error('Erro ao verificar proprietário do local:', venueError);
      throw venueError;
    }
    
    if (venueData.owner_id !== userData.user.id) {
      console.error('Tentativa de atualizar local de outro usuário');
      throw new Error('Você não tem permissão para atualizar este local');
    }
    
    // Atualizar o local
    const { data, error } = await supabase
      .from('venues')
      .update(venue)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar local:', error);
      throw error;
    }
    
    return data;
  },

  async deleteVenue(id: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o local pertence ao usuário
    const { data: venue } = await supabase
      .from('venues')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (!venue || venue.owner_id !== session.user.id) {
      throw new Error('Você não tem permissão para excluir este local');
    }

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const eventsService = {
  async createEvent(event: Omit<EventType, 'id' | 'created_at'>): Promise<EventType> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEvents(): Promise<EventType[]> {
    try {
      // Obter a data atual no formato ISO (YYYY-MM-DD)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString().split('T')[0];
      
      console.log(`Filtrando eventos a partir da data: ${todayIso}`);
      
      const { data, error } = await supabase
        .from('events')
        .select('*, venues(*)')
        .gte('date', todayIso)
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar eventos:', error);
        throw error;
      }

      console.log(`Encontrados ${data?.length || 0} eventos futuros`);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  },

  async getAllEvents(): Promise<EventType[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('events')
      .select('*, venues(*)')
      .eq('owner_id', session.user.id)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getAllEventsIncludingPast(): Promise<EventType[]> {
    try {
      console.log('Iniciando busca de todos os eventos (incluindo passados) no serviço');
      
      // Verificar se o cliente Supabase está inicializado corretamente
      if (!supabase) {
        console.error('Cliente Supabase não inicializado');
        return [];
      }
      
      // Buscar todos os eventos sem filtro de data
      const { data, error } = await supabase
        .from('events')
        .select('*, venues(*)')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar todos os eventos:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('Nenhum evento encontrado no banco de dados');
        return [];
      }

      console.log(`Encontrados ${data.length} eventos no total (incluindo passados)`);
      return data;
    } catch (error) {
      console.error('Erro ao buscar todos os eventos:', error);
      throw error;
    }
  },

  async getEventsByDate(date: string): Promise<EventType[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*, venues(*)')
      .eq('date', date)
      .order('time', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getEventById(id: string): Promise<EventType | null> {
    const { data, error } = await supabase
      .from('events')
      .select('*, venues(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateEvent(id: string, event: Omit<EventType, 'id' | 'created_at' | 'owner_id'>): Promise<EventType> {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error('Usuário não autenticado');

    // Primeiro verifica se o evento pertence ao usuário
    const { data: event } = await supabase
      .from('events')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (!event || event.owner_id !== session.user.id) {
      throw new Error('Você não tem permissão para excluir este evento');
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

export const adminService = {
  async isAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  },

  async getCurrentUserIsAdmin(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    return this.isAdmin(session.user.id);
  }
};

// Função para verificar se o Supabase está configurado corretamente
export async function verifySupabaseConfig() {
  console.log('Verificando configuração do Supabase...');
  
  // Verificar se as variáveis de ambiente estão definidas
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('VITE_SUPABASE_URL definido:', !!supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY definido:', !!supabaseKey);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis de ambiente do Supabase não estão configuradas corretamente');
    return false;
  }
  
  try {
    // Tentar fazer uma consulta simples - usando select('id') em vez de count()
    // que pode estar causando o erro 400
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erro ao verificar conexão com o Supabase:', error);
      return false;
    }
    
    console.log('Conexão com o Supabase verificada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao verificar conexão com o Supabase:', error);
    return false;
  }
}

// Função para verificar se os eventos são acessíveis para usuários não autenticados
export async function checkPublicAccess() {
  try {
    console.log('Verificando acesso público aos eventos...');
    
    // Usar o cliente Supabase existente
    const result = {
      hasPublicAccess: false,
      tables: {
        events: { exists: false, error: null, policies: [] },
        venues: { exists: false, error: null, policies: [] }
      },
      details: ''
    };
    
    // Verificar se as tabelas existem
    console.log('Verificando se as tabelas existem...');
    
    // Verificar a tabela events
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id')
      .limit(1);
    
    if (eventsError) {
      console.error('Erro ao verificar tabela events:', eventsError);
      console.error('Detalhes do erro events:', JSON.stringify(eventsError));
      result.tables.events.error = eventsError.message;
    } else {
      result.tables.events.exists = true;
    }
    
    // Verificar a tabela venues
    const { data: venuesData, error: venuesError } = await supabase
      .from('venues')
      .select('id')
      .limit(1);
    
    if (venuesError) {
      console.error('Erro ao verificar tabela venues:', venuesError);
      console.error('Detalhes do erro venues:', JSON.stringify(venuesError));
      result.tables.venues.error = venuesError.message;
    } else {
      result.tables.venues.exists = true;
    }
    
    // Verificar as políticas de acesso para cada tabela
    console.log('Verificando políticas de acesso...');
    
    // Tentar verificar políticas para events usando a função RPC
    try {
      const { data: eventsPolicies, error: eventsPoliciesError } = await supabase
        .rpc('get_policies_info', { table_name: 'events' });
      
      if (eventsPoliciesError) {
        console.warn('Erro ao verificar políticas para events:', eventsPoliciesError);
        if (eventsPoliciesError.code === 'PGRST202' && 
            eventsPoliciesError.message.includes('Could not find the function')) {
          console.log('Função RPC get_policies_info não encontrada. Isso é esperado se a função não foi criada ainda.');
        }
      } else if (eventsPolicies) {
        console.log('Políticas para events:', eventsPolicies);
        result.tables.events.policies = eventsPolicies;
      }
    } catch (e) {
      console.warn('Erro ao verificar políticas para events:', e);
    }
    
    // Tentar verificar políticas para venues usando a função RPC
    try {
      const { data: venuesPolicies, error: venuesPoliciesError } = await supabase
        .rpc('get_policies_info', { table_name: 'venues' });
      
      if (venuesPoliciesError) {
        console.warn('Erro ao verificar políticas para venues:', venuesPoliciesError);
        if (venuesPoliciesError.code === 'PGRST202' && 
            venuesPoliciesError.message.includes('Could not find the function')) {
          console.log('Função RPC get_policies_info não encontrada. Isso é esperado se a função não foi criada ainda.');
        }
      } else if (venuesPolicies) {
        console.log('Políticas para venues:', venuesPolicies);
        result.tables.venues.policies = venuesPolicies;
      }
    } catch (e) {
      console.warn('Erro ao verificar políticas para venues:', e);
    }
    
    // Determinar se há acesso público com base nas verificações
    const eventsAccessible = result.tables.events.exists && !result.tables.events.error;
    const venuesAccessible = result.tables.venues.exists && !result.tables.venues.error;
    
    result.hasPublicAccess = eventsAccessible && venuesAccessible;
    
    if (result.hasPublicAccess) {
      result.details = 'Acesso público aos eventos verificado com sucesso';
      console.log(result.details);
    } else {
      result.details = 'Problemas encontrados no acesso público aos eventos';
      console.error(result.details);
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao verificar acesso público aos eventos:', error);
    return {
      hasPublicAccess: false,
      tables: {
        events: { exists: false, error: null, policies: [] },
        venues: { exists: false, error: null, policies: [] }
      },
      details: `Erro ao verificar acesso: ${error.message}`
    };
  }
}

// Executar verificação ao inicializar
verifySupabaseConfig().then(isConfigured => {
  console.log('Supabase configurado corretamente:', isConfigured);
  
  if (isConfigured) {
    checkPublicAccess().then(hasPublicAccess => {
      console.log('Eventos têm acesso público:', hasPublicAccess);
    });
  }
}); 