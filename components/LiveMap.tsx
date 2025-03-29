'use client'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { supabase } from '@/lib/supabase'
import { pusher } from '@/lib/pusher'
import 'leaflet/dist/leaflet.css'
import dynamic from 'next/dynamic'

type Incident = {
  id: string;
  type: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
  };
  status: string;
  description?: string;
  reported_at: string;
}

// Sample data for GitHub Pages demo
const SAMPLE_INCIDENTS: Incident[] = [
  {
    id: '1',
    type: 'flood',
    location: { coordinates: [120.9842, 14.5995] }, // Manila
    status: 'pending',
    description: 'Flood in downtown area, multiple streets affected.',
    reported_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'fire',
    location: { coordinates: [120.9942, 14.6095] },
    status: 'in_progress',
    description: 'Building fire, emergency services responding.',
    reported_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: '3',
    type: 'earthquake',
    location: { coordinates: [120.9742, 14.5895] },
    status: 'resolved',
    description: 'Minor earthquake reported, no major damage.',
    reported_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '4',
    type: 'medical',
    location: { coordinates: [121.0042, 14.6195] },
    status: 'pending',
    description: 'Medical emergency requiring ambulance.',
    reported_at: new Date(Date.now() - 900000).toISOString()
  }
];

// Use dynamic import for client component
const Map = dynamic(() => Promise.resolve(MapComponent), { ssr: false })

export default function LiveMap() {
  return <Map />
}

function MapComponent() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [isGitHubPages, setIsGitHubPages] = useState(false)

  useEffect(() => {
    // Fix for Leaflet markers
    delete (window as any)._leafletMapCss
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
    document.head.appendChild(link)
    
    // Check if on GitHub Pages
    const isGitHub = window.location.hostname.includes('github.io');
    setIsGitHubPages(isGitHub);
    
    if (isGitHub) {
      // Use sample data for GitHub Pages demo
      console.log('Using sample incident data for GitHub Pages demo');
      setIncidents(SAMPLE_INCIDENTS);
      setLoading(false);
      return;
    }
    
    // Normal operation - fetch from Supabase
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
        
        if (error) throw error
        
        // Parse location data from PostGIS format
        const formattedData = data.map((incident: any) => {
          // Handle case where location might be string or already parsed
          let coordinates = incident.location?.coordinates || [0, 0]
          
          // If it's a string like "POINT(lng lat)"
          if (typeof incident.location === 'string' && incident.location.startsWith('POINT')) {
            const match = incident.location.match(/POINT\(([^ ]+) ([^)]+)\)/)
            if (match) {
              coordinates = [parseFloat(match[1]), parseFloat(match[2])]
            }
          }
          
          return {
            ...incident,
            location: {
              coordinates
            }
          }
        })
        
        setIncidents(formattedData)
      } catch (error) {
        console.error('Error fetching incidents:', error)
        
        // Fallback to sample data if there's an error
        setIncidents(SAMPLE_INCIDENTS);
      } finally {
        setLoading(false)
      }
    }
    
    fetchIncidents()
    
    // Only set up Pusher if not on GitHub Pages
    if (!isGitHub) {
      // Subscribe to new incidents
      const channel = pusher.subscribe('incidents')
      channel.bind('new', (newIncident: any) => {
        setIncidents(prev => [...prev, {
          ...newIncident,
          location: {
            coordinates: newIncident.location?.coordinates || [0, 0]
          }
        }])
      })
      
      return () => {
        pusher.unsubscribe('incidents')
      }
    }
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading map data...</div>
  }

  const getMarkerColorByStatus = (status: string) => {
    switch(status) {
      case 'pending': return 'red';
      case 'in_progress': return 'orange';
      case 'resolved': return 'green';
      default: return 'blue';
    }
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      {isGitHubPages && (
        <div className="absolute z-10 top-2 left-2 right-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200 shadow-sm">
          <p className="text-sm font-medium text-yellow-800">📍 Demo Map</p>
          <p className="text-xs text-yellow-700">This is a demo with sample data. Live database integration is disabled on GitHub Pages.</p>
        </div>
      )}
      <MapContainer 
        center={[14.5995, 120.9842]} // Default center (Manila, Philippines)
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {incidents.map((incident) => (
          <Marker 
            key={incident.id} 
            position={[
              incident.location.coordinates[1], // Lat
              incident.location.coordinates[0]  // Lng
            ]}
            // Use custom icon to represent status
          >
            <Popup>
              <div>
                <h3 className="font-bold text-lg capitalize">{incident.type}</h3>
                <p className="text-sm">{incident.description}</p>
                <p className="text-xs mt-2">
                  Status: <span className="font-medium capitalize">{incident.status}</span>
                </p>
                <p className="text-xs">
                  Reported: {new Date(incident.reported_at).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 