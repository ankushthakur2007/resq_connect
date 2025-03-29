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

// Use dynamic import for client component
const Map = dynamic(() => Promise.resolve(MapComponent), { ssr: false })

export default function LiveMap() {
  return <Map />
}

function MapComponent() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fix for Leaflet markers
    delete (window as any)._leafletMapCss
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
    document.head.appendChild(link)
    
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
      } finally {
        setLoading(false)
      }
    }
    
    fetchIncidents()
    
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
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading map data...</div>
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={[14.5995, 120.9842]} // Default center (Manila, Philippines)
        zoom={10} 
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