import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

// Dynamically import the Map component to prevent SSR issues with Leaflet
const IncidentMap = dynamic(
  () => import('@/components/IncidentMap'),
  { ssr: false }
);

type Incident = {
  id: string;
  type: string;
  description: string;
  location: string;
  status: string;
  reported_at: string;
  [key: string]: any;
};

export default function MapViewPage() {
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
  
  return (
    <div className="container mx-auto p-6 max-w-5xl h-screen flex flex-col">
      <Head>
        <title>Incident Map View</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </Head>
      
      <h1 className="text-3xl font-bold mb-4">Incident Map</h1>
      
      {loading ? (
        <div className="text-center py-8 flex-grow flex items-center justify-center">
          <p>Loading map data...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">Error: {error}</p>
          <p className="mt-2 text-sm">
            This might be due to database permissions. Please check your Supabase setup.
          </p>
        </div>
      ) : (
        <div className="flex-grow">
          <IncidentMap incidents={incidents} />
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href="/incidents" 
          className="inline-block px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          View as Table
        </a>
        <a 
          href="/emergency-form" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Report New Emergency
        </a>
      </div>
    </div>
  );
} 