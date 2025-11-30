import { SearchResult } from '../types/map';

export async function searchLocation(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    const data = await response.json();

    return data.map((item: any) => ({
      name: item.display_name,
      coordinates: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      },
      boundingBox: item.boundingbox
        ? {
            north: parseFloat(item.boundingbox[1]),
            south: parseFloat(item.boundingbox[0]),
            east: parseFloat(item.boundingbox[3]),
            west: parseFloat(item.boundingbox[2]),
          }
        : undefined,
      type: item.type,
    }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}
