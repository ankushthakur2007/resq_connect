import React, { useState, useEffect } from 'react';
import { getWeatherData, WeatherData } from '../lib/api';

interface WeatherWidgetProps {
  city?: string;
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  city = 'Delhi', 
  className = '' 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWeatherData(city);
        setWeather(data);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <p className="text-red-500">
          {error || 'Unable to load weather data'}
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{weather.city}</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{Math.round(weather.temperature)}°C</span>
            <span className="ml-2 text-gray-500 capitalize">{weather.description}</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <div>Humidity: {weather.humidity}%</div>
            <div>Wind: {weather.windSpeed} m/s</div>
          </div>
        </div>
        <div className="h-16 w-16">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
            alt={weather.description}
            width={64}
            height={64}
          />
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget; 