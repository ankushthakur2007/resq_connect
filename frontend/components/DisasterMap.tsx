import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issues in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for different disaster types
const getDisasterIcon = (type: string) => {
  const colorMap: Record<string, string> = {
    'Earthquake': '#e74c3c', // red
    'Flood': '#3498db',      // blue
    'Fire': '#f39c12',       // orange
    'Cyclone': '#9b59b6',    // purple
    'Landslide': '#8e44ad',  // dark purple
    'Other': '#95a5a6'       // gray
  };

  const color = colorMap[type] || colorMap.Other;

  return L.divIcon({
    className: 'custom-disaster-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 1px ${color};"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Animated marker that appears with a bounce effect
const AnimatedMarker = ({ position, disaster }: { position: [number, number], disaster: Disaster }) => {
  const [animate, setAnimate] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Marker 
      position={position} 
      icon={getDisasterIcon(disaster.type)}
      className={animate ? 'leaflet-marker-bounce' : ''}
    >
      <Popup>
        <div className="p-1">
          <h3 className="font-bold text-base">{disaster.type}</h3>
          <p className="text-sm text-gray-600 mb-1">{disaster.location}</p>
          {disaster.details && <p className="text-xs mt-1">{disaster.details}</p>}
          <p className="text-xs text-gray-500 mt-2">
            {new Date(disaster.timestamp).toLocaleDateString()} - {new Date(disaster.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to automatically recenter map when location changes
const SetViewOnChange = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

interface Disaster {
  id: string;
  type: string;
  location: string;
  coordinates: [number, number];
  details?: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

const MOCK_DISASTERS: Disaster[] = [
  {
    id: '1',
    type: 'Earthquake',
    location: 'Delhi, India',
    coordinates: [28.7041, 77.1025],
    details: 'Magnitude 5.8 earthquake reported',
    timestamp: '2023-05-15T08:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    type: 'Flood',
    location: 'Chennai, Tamil Nadu',
    coordinates: [13.0827, 80.2707],
    details: 'Severe flooding due to heavy rainfall',
    timestamp: '2023-06-20T10:15:00Z',
    status: 'active'
  },
  {
    id: '3',
    type: 'Fire',
    location: 'Mumbai, Maharashtra',
    coordinates: [19.0760, 72.8777],
    details: 'Industrial area fire',
    timestamp: '2023-07-05T14:45:00Z',
    status: 'resolved'
  },
  {
    id: '4',
    type: 'Cyclone',
    location: 'Bhubaneswar, Odisha',
    coordinates: [20.2961, 85.8245],
    details: 'Cyclone warning issued',
    timestamp: '2023-08-10T07:00:00Z',
    status: 'active'
  },
  {
    id: '5',
    type: 'Landslide',
    location: 'Shimla, Himachal Pradesh',
    coordinates: [31.1048, 77.1734],
    details: 'Multiple landslides reported after heavy rain',
    timestamp: '2023-09-18T11:30:00Z',
    status: 'active'
  }
];

interface DisasterMapProps {
  height?: string; // Map height
  initialCenter?: [number, number]; // Initial center coordinates
  initialZoom?: number; // Initial zoom level
  showActiveOnly?: boolean; // Show only active disasters
}

const DisasterMap: React.FC<DisasterMapProps> = ({
  height = '500px',
  initialCenter = [20.5937, 78.9629], // Center of India
  initialZoom = 5,
  showActiveOnly = false
}) => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCenter, setSelectedCenter] = useState<[number, number]>(initialCenter);

  useEffect(() => {
    // Simulate fetching disasters from API
    const fetchDisasters = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch to your API
        // const response = await fetch('/api/disasters');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setDisasters(MOCK_DISASTERS);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching disasters:', error);
        setIsLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  // Filter disasters based on props
  const filteredDisasters = showActiveOnly 
    ? disasters.filter(d => d.status === 'active') 
    : disasters;

  // Focus on specific disaster when selected
  const handleDisasterSelect = (disasterId: string) => {
    const disaster = disasters.find(d => d.id === disasterId);
    if (disaster) {
      setSelectedCenter(disaster.coordinates);
    }
  };

  // Add custom CSS for the map
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-marker-bounce {
        animation: leaflet-marker-bounce 0.5s ease-in-out;
      }
      
      @keyframes leaflet-marker-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="disaster-map-container">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <h3 className="text-lg font-semibold mr-4">Disaster Types:</h3>
        <div className="flex flex-wrap gap-3">
          {['Earthquake', 'Flood', 'Fire', 'Cyclone', 'Landslide', 'Other'].map(type => (
            <div key={type} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-1" 
                style={{ 
                  backgroundColor: type === 'Earthquake' ? '#e74c3c' : 
                                  type === 'Flood' ? '#3498db' : 
                                  type === 'Fire' ? '#f39c12' : 
                                  type === 'Cyclone' ? '#9b59b6' : 
                                  type === 'Landslide' ? '#8e44ad' : '#95a5a6'
                }}
              ></div>
              <span className="text-xs text-gray-700">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md" style={{ height }}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading disaster map...</p>
            </div>
          </div>
        ) : (
          <MapContainer 
            center={initialCenter} 
            zoom={initialZoom} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredDisasters.map(disaster => (
              <AnimatedMarker 
                key={disaster.id} 
                position={disaster.coordinates} 
                disaster={disaster} 
              />
            ))}
            
            <SetViewOnChange center={selectedCenter} />
          </MapContainer>
        )}
      </div>

      {filteredDisasters.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Recent Disasters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDisasters.slice(0, 3).map(disaster => (
              <div 
                key={disaster.id} 
                className={`p-3 rounded-md shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 ${
                  disaster.status === 'active' ? 'border-red-500' : 'border-green-500'
                }`}
                onClick={() => handleDisasterSelect(disaster.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm">{disaster.type}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    disaster.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {disaster.status === 'active' ? 'Active' : 'Resolved'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{disaster.location}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(disaster.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisasterMap; 