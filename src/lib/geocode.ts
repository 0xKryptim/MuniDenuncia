import type { Location } from './types';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

export async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Mairie-Issues-App',
        },
      }
    );

    if (!response.ok) return undefined;

    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return undefined;
  }
}

export async function searchAddress(query: string): Promise<Location[]> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'Mairie-Issues-App',
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: item.display_name,
    }));
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}

export async function getCurrentPosition(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const address = await reverseGeocode(lat, lng);

        resolve({ lat, lng, address });
      },
      () => {
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
