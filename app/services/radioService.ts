import { RadioBrowserApi } from 'radio-browser-api';

// Create an instance of the RadioBrowserApi
const api = new RadioBrowserApi('Radio Map Application');

// This interface matches the actual structure returned by the radio-browser-api
export interface RadioStation {
  id: string;
  name: string;
  url: string;
  favicon: string;
  countryCode: string;
  country: string;
  state: string;
  language: string[] | string; // API returns an array, but we'll handle it as string for display
  codec: string;
  bitrate: number;
  votes: number;
  geoLat?: number; // The API actually returns geoLat, not geo_lat
  geoLong?: number; // The API actually returns geoLong, not geo_long
}

// Function to get stations for a specific country if they're missing from the geo data
export async function getRadioStationsForCountry(countryCode: string, limit: number = 50): Promise<RadioStation[]> {
  try {
    const stations = await api.searchStations({
      countryCode: countryCode,
      limit,
    });
    
    return stations as unknown as RadioStation[];
  } catch (error) {
    console.error(`Error fetching radio stations for ${countryCode}:`, error);
    return [];
  }
}

// List of important countries we want to ensure have stations
const IMPORTANT_COUNTRIES = [
  { name: 'India', code: 'IN' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Japan', code: 'JP' },
  { name: 'China', code: 'CN' },
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Russia', code: 'RU' },
];

// Helper function to assign random coordinates within a country's typical boundaries
// This is a fallback for stations missing geo coordinates
const COUNTRY_BOUNDARIES: Record<string, { lat: [number, number], long: [number, number] }> = {
  'IN': { lat: [8, 35], long: [68, 97] }, // India
  'US': { lat: [24, 49], long: [-125, -66] }, // United States
  'GB': { lat: [49, 59], long: [-8, 2] }, // United Kingdom
  'JP': { lat: [30, 46], long: [129, 146] }, // Japan
  'CN': { lat: [18, 54], long: [73, 135] }, // China
  'AU': { lat: [-43, -10], long: [113, 154] }, // Australia
  'BR': { lat: [-33, 5], long: [-74, -34] }, // Brazil
  'RU': { lat: [41, 82], long: [19, 180] }, // Russia
};

function getRandomCoordinateForCountry(countryCode: string): { geoLat: number, geoLong: number } | null {
  const bounds = COUNTRY_BOUNDARIES[countryCode];
  if (!bounds) return null;
  
  const randomLat = bounds.lat[0] + Math.random() * (bounds.lat[1] - bounds.lat[0]);
  const randomLong = bounds.long[0] + Math.random() * (bounds.long[1] - bounds.long[0]);
  
  return {
    geoLat: parseFloat(randomLat.toFixed(6)),
    geoLong: parseFloat(randomLong.toFixed(6))
  };
}

export async function getRadioStationsWithGeoData(limit: number = 800): Promise<RadioStation[]> {
  try {
    // First get stations with geographic coordinates
    const stationsWithGeo = await api.searchStations({
      limit,
      hasGeoInfo: true,
    });

    // Filter out stations without valid coordinates
    const validGeoStations = stationsWithGeo.filter(
      (station) => 
        station.geoLat && 
        station.geoLong && 
        !isNaN(station.geoLat) && 
        !isNaN(station.geoLong)
    ) as unknown as RadioStation[];
    
    // Collect countries that are missing or have few stations
    const countryCounts = validGeoStations.reduce((acc, station) => {
      const country = station.countryCode || 'unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get additional stations for countries with few or no stations
    const additionalStationsPromises = IMPORTANT_COUNTRIES
      .filter(country => !countryCounts[country.code] || countryCounts[country.code] < 5)
      .map(country => getRadioStationsForCountry(country.code, 20));
    
    const additionalStationsArrays = await Promise.all(additionalStationsPromises);
    let additionalStations = additionalStationsArrays.flat();
    
    // Assign coordinates to stations without them
    additionalStations = additionalStations.map(station => {
      if (!station.geoLat || !station.geoLong || isNaN(station.geoLat) || isNaN(station.geoLong)) {
        const randomCoords = getRandomCoordinateForCountry(station.countryCode);
        if (randomCoords) {
          return { ...station, ...randomCoords };
        }
      }
      return station;
    });
    
    // Filter out duplicates based on station id
    const allStations = [...validGeoStations];
    additionalStations.forEach(station => {
      if (!allStations.some(s => s.id === station.id) && station.geoLat && station.geoLong) {
        allStations.push(station);
      }
    });
    
    return allStations;
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
}
