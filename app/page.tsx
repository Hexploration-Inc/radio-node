"use client";

import { useEffect, useState } from 'react';
import { getRadioStationsWithGeoData, RadioStation } from './services/radioService';
import WorldMap from './components/WorldMap';
import AudioPlayer from './components/AudioPlayer';

export default function Home() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStations() {
      try {
        setLoading(true);
        const stationsData = await getRadioStationsWithGeoData(500);
        
        if (stationsData.length === 0) {
          setError('No radio stations found with geographic data');
        } else {
          setStations(stationsData);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load radio stations:', err);
        setError('Failed to load radio stations. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadStations();
  }, []);

  const handleStationSelect = (station: RadioStation) => {
    setCurrentStation(station);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black px-4 py-8 pb-32">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">World Radio Map</h1>
        <p className="text-gray-400">Discover and listen to radio stations from around the world</p>
      </header>

      <main className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading radio stations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 rounded-xl p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-lg font-medium text-red-300 mb-1">Error</h2>
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-200">Interactive Radio Map</h2>
                  <p className="text-sm text-gray-400">Click on a station marker to listen</p>
                </div>
                <div className="text-sm text-gray-400">
                  {stations.length} stations available
                </div>
              </div>
              <WorldMap 
                stations={stations} 
                onStationSelect={handleStationSelect} 
                currentStation={currentStation} 
              />
            </div>
          </div>
        )}
      </main>

      <AudioPlayer station={currentStation} />
    </div>
  );
}
