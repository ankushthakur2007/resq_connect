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

// Helper for making external API requests
async function fetchExternalAPI(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'An error occurred while fetching data');
    }

    return response.json();
  } catch (error) {
    console.error('External API error:', error);
    throw error;
  }
}

// Alert/Emergency API
export async function sendAlert(data: { type: string; location: string; details?: string }) {
  return fetchAPI('alert', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Weather API
export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  // Using OpenWeatherMap API with public API key (replace with your own in production)
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API || "demo_key";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  
  try {
    const data = await fetchExternalAPI(url);
    
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error("Weather API error:", error);
    return getMockWeatherData(city);
  }
}

// Earthquake API
export interface EarthquakeData {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  coordinates: [number, number, number]; // longitude, latitude, depth
  url: string;
  felt: number | null;
  tsunami: number;
}

export async function getEarthquakeData(limit = 5): Promise<EarthquakeData[]> {
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=${limit}`;
  
  try {
    const data = await fetchExternalAPI(url);
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: new Date(feature.properties.time).toISOString(),
      coordinates: feature.geometry.coordinates,
      url: feature.properties.url,
      felt: feature.properties.felt,
      tsunami: feature.properties.tsunami
    }));
  } catch (error) {
    console.error("Earthquake API error:", error);
    return getMockEarthquakeData();
  }
}

// Chatbot API integration
export interface ChatbotMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatbotResponse(message: string, history: ChatbotMessage[] = []): Promise<string> {
  try {
    // In a real implementation, you would call your chatbot API here
    // const url = "https://api.chatbot-provider.com/chat";
    // const response = await fetchExternalAPI(url, {
    //   method: 'POST',
    //   body: JSON.stringify({ message, history })
    // });
    // return response.reply;
    
    // For now, returning a mock response
    return getMockChatbotResponse(message);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
  }
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

// Mock weather data
function getMockWeatherData(city: string): WeatherData {
  return {
    city,
    temperature: 28,
    description: 'Partly cloudy',
    humidity: 65,
    windSpeed: 5.2,
    icon: '02d'
  };
}

// Mock earthquake data
function getMockEarthquakeData(): EarthquakeData[] {
  return [
    {
      id: 'us7000jk12',
      magnitude: 5.8,
      place: 'Northern India',
      time: new Date().toISOString(),
      coordinates: [77.1025, 28.7041, 10],
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000jk12',
      felt: 1200,
      tsunami: 0
    },
    {
      id: 'us7000jk11',
      magnitude: 4.2,
      place: 'Bay of Bengal, off Chennai coast',
      time: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      coordinates: [80.2707, 13.0827, 15],
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000jk11',
      felt: 800,
      tsunami: 0
    },
    {
      id: 'us7000jk10',
      magnitude: 3.5,
      place: 'Western Maharashtra',
      time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      coordinates: [72.8777, 19.0760, 5],
      url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000jk10',
      felt: 520,
      tsunami: 0
    }
  ];
}

// Mock chatbot responses
function getMockChatbotResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm the ResQconnect assistant. How can I help you with disaster preparedness or emergency response today?";
  }
  
  if (lowerMessage.includes('weather')) {
    return "I can provide weather information for your location. In a real implementation, this would connect to a weather API. Is there a specific city you'd like to check?";
  }
  
  if (lowerMessage.includes('earthquake')) {
    return "I can provide information about recent earthquakes. In a real implementation, this would connect to the USGS earthquake data. Would you like to know about recent seismic activity?";
  }
  
  if (lowerMessage.includes('flood') || lowerMessage.includes('flooding')) {
    return "Flooding can be dangerous. If you're experiencing flooding, move to higher ground immediately. For flood alerts, please check the official meteorological department website or local news.";
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
    return "If you're experiencing an emergency, please call your local emergency number immediately (like 112 in India). Don't wait for online assistance.";
  }
  
  return "I'm here to provide information about disaster preparedness and emergency response. How can I assist you today?";
} 