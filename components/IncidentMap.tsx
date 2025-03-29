import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for marker icons
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Fallback to using CDN URLs if local icons are missing
DefaultIcon.options.iconUrl = DefaultIcon.options.iconUrl || 
  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
DefaultIcon.options.shadowUrl = DefaultIcon.options.shadowUrl || 
  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = DefaultIcon;

// Different colors for different incident types
const typeToColor = {
  FIRE: 'red',
  MEDICAL: 'blue',
  POLICE: 'purple',
  FLOOD: 'cyan',
  EARTHQUAKE: 'orange',
  TEST: 'gray',
  DEFAULT: 'green'
};

type IncidentMapProps = {
  incidents: Array<{
    id: string;
    type: string;
    description: string;
    location: string;
    status: string;
    reported_at: string;
    [key: string]: any;
  }>;
};

type LatLng = {
  lat: number;
  lng: number;
};

const IncidentMap: React.FC<IncidentMapProps> = ({ incidents }) => {
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 0, lng: 0 });
  const [parsedIncidents, setParsedIncidents] = useState<Array<any>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Parse location data from PostGIS format (or other string formats)
  useEffect(() => {
    try {
      const parsed = incidents
        .map(incident => {
          try {
            // Try to parse from PostGIS POINT format, e.g. "POINT(longitude latitude)"
            const match = incident.location.match(/POINT\(([^ ]+) ([^)]+)\)/);
            if (match) {
              const lng = parseFloat(match[1]);
              const lat = parseFloat(match[2]);
              
              if (isNaN(lat) || isNaN(lng)) {
                console.warn(`Invalid coordinates for incident ${incident.id}`);
                return null;
              }
              
              return {
                ...incident,
                coordinates: { lat, lng }
              };
            }
            
            // Fallback for other formats or missing data
            console.warn(`Couldn't parse location for incident ${incident.id}: ${incident.location}`);
            return null;
          } catch (e) {
            console.error(`Error parsing incident ${incident.id}:`, e);
            return null;
          }
        })
        .filter(Boolean); // Remove null entries
        
      setParsedIncidents(parsed);
      
      // Set map center to the first valid incident, or a default
      if (parsed.length > 0) {
        setMapCenter(parsed[0].coordinates);
      } else {
        // Default to a central location if no valid incidents
        setMapCenter({ lat: 40.7128, lng: -74.0060 }); // New York City
      }
      
      setMapLoaded(true);
    } catch (error) {
      console.error('Error processing incidents for map:', error);
    }
  }, [incidents]);
  
  // Get marker color based on incident type
  const getMarkerColor = (type: string): string => {
    const color = typeToColor[type as keyof typeof typeToColor] || typeToColor.DEFAULT;
    return color;
  };
  
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  if (!mapLoaded) {
    return <div className="flex items-center justify-center h-full">Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={mapCenter} 
      zoom={13} 
      style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {parsedIncidents.map(incident => (
        <Marker 
          key={incident.id} 
          position={incident.coordinates}
          icon={new L.Icon({
            ...DefaultIcon.options,
            iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${getMarkerColor(incident.type)}.png`,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png'
          })}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{incident.type} Incident</h3>
              <p className="mt-1">{incident.description}</p>
              <div className="mt-2 text-sm">
                <p><span className="font-semibold">Status:</span> {incident.status}</p>
                <p><span className="font-semibold">Reported:</span> {formatDate(incident.reported_at)}</p>
                <p><span className="font-semibold">Location:</span> {incident.coordinates.lat.toFixed(6)}, {incident.coordinates.lng.toFixed(6)}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default IncidentMap; 