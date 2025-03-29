import React, { useState, useEffect } from 'react';
import { getEarthquakeData, EarthquakeData } from '../lib/api';

interface EarthquakeTrackerProps {
  limit?: number;
  className?: string;
}

const EarthquakeTracker: React.FC<EarthquakeTrackerProps> = ({ 
  limit = 5,
  className = ''
}) => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEarthquakeData(limit);
        setEarthquakes(data);
      } catch (err) {
        setError('Failed to load earthquake data');
        console.error('Earthquake fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
  }, [limit]);

  // Get color based on magnitude
  const getMagnitudeColor = (magnitude: number): string => {
    if (magnitude >= 7.0) return 'text-red-600 bg-red-100';
    if (magnitude >= 5.0) return 'text-orange-600 bg-orange-100';
    if (magnitude >= 3.0) return 'text-amber-600 bg-amber-100';
    return 'text-blue-600 bg-blue-100';
  };

  // Format the time to be more readable
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Recent Earthquakes</h3>
        <div className="space-y-3">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="animate-pulse border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !earthquakes.length) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h3 className="text-lg font-semibold mb-4">Recent Earthquakes</h3>
        <p className="text-red-500">
          {error || 'No earthquake data available'}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Recent Earthquakes</h3>
      <div className="space-y-3">
        {earthquakes.map((quake) => (
          <div key={quake.id} className="border rounded-md p-3 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{quake.place}</h4>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getMagnitudeColor(quake.magnitude)}`}>
                M{quake.magnitude.toFixed(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {formatTime(quake.time)}
            </p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Depth: {quake.coordinates[2]} km
              </span>
              {quake.felt && (
                <span>
                  Felt by: {quake.felt} people
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a 
          href="https://earthquake.usgs.gov/earthquakes/map/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-hover text-sm font-medium"
        >
          View more at USGS
        </a>
      </div>
    </div>
  );
};

export default EarthquakeTracker; 