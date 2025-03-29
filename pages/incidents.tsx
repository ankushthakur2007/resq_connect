import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';

type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  status: string;
  reported_at: string;
  [key: string]: any;
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchIncidents() {
      try {
        // Attempt to fetch incidents from the database
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('reported_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setIncidents(data || []);
      } catch (err) {
        console.error('Error fetching incidents:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    
    fetchIncidents();
  }, []);
  
  // Function to format location from POINT format to readable text
  const formatLocation = (location: string) => {
    if (!location) return 'Unknown';
    
    try {
      // Try to parse from PostGIS POINT format, e.g. "POINT(longitude latitude)"
      const match = location.match(/POINT\(([^ ]+) ([^)]+)\)/);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
      
      return location;
    } catch (e) {
      return location;
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Head>
        <title>Reported Incidents</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Reported Incidents</h1>
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading incidents...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Error: {error}</p>
          <p className="mt-2 text-sm">
            This might be due to database permissions. Please check your Supabase setup.
          </p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p>No incidents reported yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Location</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Reported At</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(incident => (
                <tr key={incident.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      incident.type === 'FIRE' ? 'bg-red-100 text-red-800' :
                      incident.type === 'MEDICAL' ? 'bg-blue-100 text-blue-800' :
                      incident.type === 'POLICE' ? 'bg-purple-100 text-purple-800' :
                      incident.type === 'FLOOD' ? 'bg-cyan-100 text-cyan-800' :
                      incident.type === 'EARTHQUAKE' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {incident.type}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{incident.description}</td>
                  <td className="py-2 px-4 border-b">{formatLocation(incident.location)}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      incident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      incident.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{formatDate(incident.reported_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <a 
          href="/map-view" 
          className="inline-block px-6 py-3 mr-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          View on Map
        </a>
        <a 
          href="/emergency-form" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Report New Emergency
        </a>
      </div>
    </div>
  );
} 