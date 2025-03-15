import React, { useEffect, useRef, useState } from 'react';
import { RadioStation } from '../services/radioService';
import { Howl } from 'howler';

interface AudioPlayerProps {
  station: RadioStation | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ station }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);

  // Clean up and create a new Howl instance when the station changes
  useEffect(() => {
    // Clean up previous Howl instance
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    setError(null);
    setIsPlaying(false);
    
    if (station?.url) {
      setIsLoading(true);
      
      soundRef.current = new Howl({
        src: [station.url],
        html5: true, // Essential for streaming
        format: ['mp3', 'aac'],
        volume: volume,
        onplay: () => {
          setIsPlaying(true);
          setIsLoading(false);
        },
        onload: () => {
          setIsLoading(false);
        },
        onloaderror: () => {
          setIsLoading(false);
          setError('Failed to load station');
        },
        onplayerror: () => {
          setIsPlaying(false);
          setIsLoading(false);
          setError('Failed to play station');
        },
        onstop: () => {
          setIsPlaying(false);
        },
        onend: () => {
          setIsPlaying(false);
        }
      });
      
      // Auto-play when station changes
      soundRef.current.play();
    }
    
    // Clean up on component unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
  }, [station?.url]);

  // Update volume when it changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  if (!station) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 shadow-lg">
        <div className="text-center text-gray-400">
          Select a radio station on the map to start listening
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 border-t border-gray-700 shadow-lg">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {station.favicon ? (
              <img 
                src={station.favicon} 
                alt={station.name} 
                className="w-12 h-12 rounded-md object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/radio-placeholder.png';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-teal-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-100 truncate">{station.name}</h3>
            <p className="text-xs text-gray-400">
              {station.country} • {station.codec} • {station.bitrate}kbps
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.414-7.072m-2.828 9.9a9 9 0 010-12.728" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-teal-500"
            />
          </div>
          
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
