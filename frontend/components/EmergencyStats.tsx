import React, { useEffect, useState } from 'react';
import { getMockEmergencyStats } from '../lib/api';

interface EmergencyStatsData {
  activeAlerts: number;
  responderTeams: number;
  affectedAreas: number;
  evacuees: number;
}

const EmergencyStats: React.FC = () => {
  const [stats, setStats] = useState<EmergencyStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, this would fetch from the API
        // const response = await fetch('/api/emergency-stats');
        // const data = await response.json();
        
        // Using mock data for now
        const data = getMockEmergencyStats();
        
        setStats(data);
      } catch (error) {
        console.error('Error fetching emergency stats:', error);
        // Use fallback data if API fails
        setStats({
          activeAlerts: 0,
          responderTeams: 0,
          affectedAreas: 0,
          evacuees: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-6 animate-pulse h-32">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-red-600">Failed to load emergency statistics</div>;
  }

  const statItems = [
    { 
      label: 'Active Alerts', 
      value: stats.activeAlerts, 
      color: 'bg-red-100 text-red-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    { 
      label: 'Responder Teams', 
      value: stats.responderTeams, 
      color: 'bg-blue-100 text-blue-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      label: 'Affected Areas', 
      value: stats.affectedAreas, 
      color: 'bg-amber-100 text-amber-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      label: 'Evacuees', 
      value: stats.evacuees, 
      color: 'bg-green-100 text-green-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`${item.color} rounded-lg p-4 flex flex-col items-center justify-center text-center shadow-md hover:shadow-lg transition-shadow duration-300`}
        >
          <div className="mb-2">
            {item.icon}
          </div>
          <p className="text-sm font-medium mb-1">{item.label}</p>
          <p className="text-2xl md:text-3xl font-bold">{item.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default EmergencyStats; 