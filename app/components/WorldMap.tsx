import React, { useCallback, useState, memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup
} from 'react-simple-maps';
import { RadioStation } from '../services/radioService';

// World map topojson file - using a more detailed source with better borders
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Default map settings
const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1.5; // Larger step for more noticeable zoom changes

// Major countries to label on the map for better orientation
const COUNTRY_LABELS = [
  { name: "United States", coordinates: [-98, 40] as [number, number], markerOffset: 0 },
  { name: "Canada", coordinates: [-100, 60] as [number, number], markerOffset: 0 },
  { name: "Brazil", coordinates: [-55, -10] as [number, number], markerOffset: 0 },
  { name: "Argentina", coordinates: [-65, -35] as [number, number], markerOffset: 0 },
  { name: "United Kingdom", coordinates: [-2, 54] as [number, number], markerOffset: 0 },
  { name: "France", coordinates: [2, 47] as [number, number], markerOffset: 0 },
  { name: "Germany", coordinates: [10, 51] as [number, number], markerOffset: 0 },
  { name: "Italy", coordinates: [12, 42] as [number, number], markerOffset: 0 },
  { name: "Spain", coordinates: [-3, 40] as [number, number], markerOffset: 0 },
  { name: "Russia", coordinates: [90, 60] as [number, number], markerOffset: 0 },
  { name: "China", coordinates: [105, 35] as [number, number], markerOffset: 0 },
  { name: "India", coordinates: [80, 20] as [number, number], markerOffset: 0 },
  { name: "Australia", coordinates: [133, -25] as [number, number], markerOffset: 0 },
  { name: "Japan", coordinates: [138, 38] as [number, number], markerOffset: 0 },
];

interface WorldMapProps {
  stations: RadioStation[];
  onStationSelect: (station: RadioStation) => void;
  currentStation: RadioStation | null;
}

const WorldMap: React.FC<WorldMapProps> = memo(({ stations, onStationSelect, currentStation }) => {
  const [hoveredStation, setHoveredStation] = useState<RadioStation | null>(null);

  // States for map position
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);

  const handleMarkerClick = useCallback((station: RadioStation) => {
    onStationSelect(station);
  }, [onStationSelect]);

  // Zoom control functions
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev * ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(MIN_ZOOM, prev / ZOOM_STEP));
  }, []);
  
  // This is called after the map is dragged
  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    setCenter(position.coordinates);
    setZoom(position.zoom);
  }, []);

  return (
    <div className="w-full h-[75vh] bg-gray-900 rounded-xl shadow-md overflow-hidden relative">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold p-2 rounded shadow-lg transition-colors"
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold p-2 rounded shadow-lg transition-colors"
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          onClick={() => {
            setZoom(DEFAULT_ZOOM);
            setCenter(DEFAULT_CENTER);
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white font-bold p-2 rounded shadow-lg transition-colors"
          aria-label="Reset view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Map help tooltip */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800 bg-opacity-80 text-white text-xs p-2 rounded">
        <p>Drag to pan | Wheel to zoom | Double-click to zoom in</p>
      </div>
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 20]
        }}
        style={{
          background: '#121212', // Dark background
          width: "100%",
          height: "100%",
          outline: 'none',
        }}
      >
        <ZoomableGroup 
          zoom={zoom}
          center={center}
          onMoveStart={position => {
            // Optional: Add any animation or state changes when movement starts
          }}
          onMove={({ zoom }) => {
            // Optional: Track movement in real-time if needed
          }}
          onMoveEnd={handleMoveEnd}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
      
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlighted = stations.some(station => 
                  station.country && geo.properties.name && 
                  station.country.toLowerCase() === geo.properties.name.toLowerCase());
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlighted ? "#2c5282" : "#1a202c"}
                    stroke="#2A303C"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: 'none',
                        transition: 'all 0.3s ease',
                      },
                      hover: {
                        fill: '#2d3748',
                        stroke: '#94A3B8',
                        strokeWidth: 1,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#3B5480',
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>

        {/* Add country labels for better geographical context */}
        {COUNTRY_LABELS.map(({ name, coordinates, markerOffset }) => (
          <Annotation
            key={name}
            subject={coordinates}
            dx={0}
            dy={0}
            connectorProps={{}}
          >
            <text
              x={4}
              y={markerOffset}
              fontSize={8}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#e2e8f0"
              opacity={0.9}
              style={{ pointerEvents: "none" }}
            >
              {name}
            </text>
          </Annotation>
        ))}

          {stations.map((station) => (
            <Marker
              key={station.id}
              coordinates={[station.geoLong || 0, station.geoLat || 0]}
              onClick={() => handleMarkerClick(station)}
              onMouseEnter={() => setHoveredStation(station)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              <circle
                r={currentStation?.id === station.id ? 5 : 3}
                fill={currentStation?.id === station.id ? "#FF4500" : "#38b2ac"} // Teal for stations
                stroke="#FFFFFF"
                strokeWidth={1}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                }}
                className="hover:fill-blue-400"
              />

          </Marker>
        ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Small legend for the map */}
      <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-90 p-2 rounded shadow-md text-xs text-gray-100">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-[#38b2ac] mr-1"></div>
          <span>Radio Station</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-[#FF4500] mr-1"></div>
          <span>Selected Station</span>
        </div>
      </div>
      

    </div>
  );
});

export default WorldMap;
