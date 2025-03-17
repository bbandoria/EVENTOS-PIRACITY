interface GeocodingResult {
  lat: number;
  lng: number;
}

export async function getCoordinatesFromAddress(address: string): Promise<GeocodingResult | null> {
  try {
    // Adiciona ", Piracicaba, SP, Brasil" ao endereço para melhorar a precisão
    const fullAddress = `${address}, Piracicaba, SP, Brasil`;
    const encodedAddress = encodeURIComponent(fullAddress);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'EventosPira/1.0' // Identificação necessária para a API do Nominatim
        }
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter coordenadas:', error);
    return null;
  }
} 