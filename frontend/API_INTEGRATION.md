# ResQConnect API Integrations

This document explains how to work with the API integrations in the ResQConnect project.

## Available APIs

ResQConnect integrates with several external APIs to provide real-time information during disasters:

1. **Weather API** - Get current weather conditions for any location
2. **Earthquake API** - Track recent earthquake activity from USGS
3. **Chatbot API** - Provide assistance and information about disaster preparedness

## Configuration

API keys are stored in the `.env.local` file. Copy the `.env.local.example` file and rename it to `.env.local`, then add your API keys:

```bash
# Example .env.local file
NEXT_PUBLIC_OPENWEATHER_API=your_openweather_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_CHATBOT_API=your_chatbot_api_key
```

## Using the API Services

### Weather API

```typescript
import { getWeatherData } from '../lib/api';

// Get weather for a specific city
const weather = await getWeatherData('Delhi');
console.log(weather);
// {
//   city: 'Delhi',
//   temperature: 28,
//   description: 'Partly cloudy',
//   humidity: 65,
//   windSpeed: 5.2,
//   icon: '02d'
// }
```

### Earthquake API

```typescript
import { getEarthquakeData } from '../lib/api';

// Get recent earthquakes (default limit is 5)
const earthquakes = await getEarthquakeData();

// Get more earthquakes
const moreEarthquakes = await getEarthquakeData(10);
```

### Chatbot API

```typescript
import { getChatbotResponse } from '../lib/api';

// Get a response from the chatbot
const response = await getChatbotResponse('What should I do during a flood?');
console.log(response);
// "During a flood, move to higher ground immediately..."
```

## Components

The project includes pre-built components that use these APIs:

- **WeatherWidget**: Displays current weather for a location
- **EarthquakeTracker**: Shows recent earthquake activity
- **ChatAssistant**: Provides an interactive chat interface for disaster assistance
- **DisasterMap**: Visualizes disaster locations on a map

## Integrating in Your Own Components

You can easily integrate these APIs into your own components:

```typescript
import React, { useState, useEffect } from 'react';
import { getWeatherData } from '../lib/api';

const MyCustomWeather = () => {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getWeatherData('Mumbai');
      setWeather(data);
    };
    
    fetchData();
  }, []);
  
  if (!weather) return <p>Loading...</p>;
  
  return (
    <div>
      <h2>{weather.city}</h2>
      <p>{weather.temperature}°C - {weather.description}</p>
    </div>
  );
};
```

## Error Handling

All API functions include error handling and fallback to mock data if the API is unavailable. This ensures that your application continues to function even when external services are down.

## Adding New APIs

To add a new API integration:

1. Add any required API keys to `.env.local`
2. Create interfaces for the data in `lib/api.ts`
3. Add functions to fetch from the API with proper error handling
4. Create mock data functions for fallback purposes
5. Build components that use the new API

## Best Practices

- Always handle loading states and errors in your components
- Use the mock data for development and testing
- Don't expose API keys in client-side code (use environment variables)
- Keep API request functions separate from UI components for better reusability 