// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://ankushthakur2007.github.io/resq_connect/api'
  : 'http://localhost:3000/api');

// Helper for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'An error occurred while fetching data');
  }

  return response.json();
}

// Alert/Emergency API
export async function sendAlert(data: { type: string; location: string; details?: string }) {
  return fetchAPI('alert', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Mock data for when backend is not available
export const getMockProjects = () => {
  return [
    {
      id: 1,
      title: 'Flood Relief Initiative',
      description: 'Supporting communities affected by recent flooding with emergency supplies and cleanup efforts.',
      image: 'https://placehold.co/600x400/3498db/FFFFFF?text=Flood+Relief',
      status: 'Active',
      volunteers: 85,
      location: 'Chennai, Tamil Nadu'
    },
    {
      id: 2,
      title: 'Earthquake Response',
      description: 'Providing shelter and medical assistance to those affected by the earthquake.',
      image: 'https://placehold.co/600x400/e74c3c/FFFFFF?text=Earthquake+Response',
      status: 'Active',
      volunteers: 120,
      location: 'Kutch, Gujarat'
    },
    {
      id: 3,
      title: 'Cyclone Preparedness',
      description: 'Training local communities on cyclone safety and early evacuation procedures.',
      image: 'https://placehold.co/600x400/9b59b6/FFFFFF?text=Cyclone+Preparedness',
      status: 'Upcoming',
      volunteers: 50,
      location: 'Odisha'
    },
    {
      id: 4,
      title: 'Fire Safety Workshops',
      description: 'Conducting workshops to educate people about preventing and responding to fires in urban areas.',
      image: 'https://placehold.co/600x400/f39c12/FFFFFF?text=Fire+Safety',
      status: 'Completed',
      volunteers: 35,
      location: 'Delhi'
    }
  ];
};

export const getMockEmergencyStats = () => {
  return {
    activeAlerts: 12,
    responderTeams: 8,
    affectedAreas: 5,
    evacuees: 245
  };
}; 