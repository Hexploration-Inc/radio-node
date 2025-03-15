import React, { useCallback, useState } from 'react';
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

const WorldMap: React.FC<WorldMapProps> = ({ stations, onStationSelect, currentStation }) => {
  const [hoveredStation, setHoveredStation] = useState<RadioStation | null>(null);

  const handleMarkerClick = useCallback((station: RadioStation) => {
    onStationSelect(station);
  }, [onStationSelect]);

  return (
    <div className="w-full h-[75vh] bg-gray-900 rounded-xl shadow-md overflow-hidden relative">
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
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={3}>
      
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
              {(hoveredStation?.id === station.id || currentStation?.id === station.id) && (
                <g transform="translate(0, -15)">
                  <rect
                    x="-35"
                    y="-15"
                    width="70"
                    height="20"
                    rx="5"
                    fill="rgba(0, 0, 0, 0.8)"
                  />
                  <text
                    textAnchor="middle"
                    y="-3"
                    style={{ 
                      fontSize: '8px',
                      fill: "#FFFFFF",
                      fontWeight: 'bold',
                    }}
                  >
                    {station.name.length > 12 ? station.name.substring(0, 10) + '...' : station.name}
                  </text>
                  <text
                    textAnchor="middle"
                    y="5"
                    style={{ 
                      fontSize: '7px',
                      fill: "#FFFFFF",
                    }}
                  >
                    {station.country}
                  </text>
                </g>
              )}
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
};

export default WorldMap;
