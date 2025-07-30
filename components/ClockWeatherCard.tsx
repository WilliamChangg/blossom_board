'use client';

import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, MapPin } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

interface WeatherData {
  location: string;
  temperature: number;
  icon: string;
}

export const ClockWeatherCard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Clock logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Weather logic
  useEffect(() => {
    const fetchWeather = async () => {
      // Check cache first
      const cachedWeather = localStorage.getItem('weather-data');
      const cacheTimestamp = localStorage.getItem('weather-timestamp');
      const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes
      
      if (cachedWeather && cacheTimestamp) {
        const timeSinceCache = Date.now() - parseInt(cacheTimestamp);
        if (timeSinceCache < CACHE_DURATION) {
          setWeather(JSON.parse(cachedWeather));
          setWeatherLoading(false);
          return;
        }
      }

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          });
        });

        const { latitude, longitude } = position.coords;
        
        if (!API_KEY) {
          setWeather({
            location: 'Your Location',
            temperature: 22,
            icon: 'clouds'
          });
          setWeatherLoading(false);
          return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Weather API error');
        }

        const data = await response.json();
        
        const weatherData = {
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].description.replace(/\b\w/g, (l: string) => l.toUpperCase()),
          icon: data.weather[0].main.toLowerCase()
        };
        
        localStorage.setItem('weather-data', JSON.stringify(weatherData));
        localStorage.setItem('weather-timestamp', Date.now().toString());
        
        setWeather(weatherData);
      } catch (err) {
        // Fallback to mock data
        setWeather({
          location: 'Your Location',
          temperature: 22,
          icon: 'clouds'
        });
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }).replace(' ', '');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDay = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="w-7 h-7 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="w-7 h-7 text-gray-400" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="w-7 h-7 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="w-7 h-7 text-blue-200" />;
      default:
        return <Cloud className="w-7 h-7 text-gray-400" />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-500';
    if (temp >= 20) return 'text-orange-500';
    if (temp >= 10) return 'text-green-500';
    if (temp >= 0) return 'text-blue-500';
    return 'text-purple-500';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-2xl p-8 mb-8">
      {/* Background styling */}
      <div className="absolute inset-0 bg-pink-50/20 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300/30 via-transparent to-transparent" />
      
      <div className="relative z-10">
        {/* Weather Section - Top Right Corner */}
        <div className="absolute top-0 right-0">
          {weatherLoading ? (
            <div className="animate-pulse text-right space-y-2">
              <div className="w-10 h-10 bg-pink-300 rounded-full ml-auto"></div>
              <div className="h-5 bg-pink-300 rounded w-16 ml-auto"></div>
              <div className="h-3 bg-pink-300 rounded w-20 ml-auto"></div>
            </div>
          ) : weather ? (
            <div className="text-right space-y-2">
              {/* Temperature and Icon */}
              <div className="flex items-center justify-end gap-2">
                {getWeatherIcon(weather.icon)}
                <span className={`text-2xl font-bold ${getTemperatureColor(weather.temperature)}`}>
                  {weather.temperature}°
                </span>
              </div>
              
              {/* Location */}
              <div className="flex items-center justify-end gap-1 text-pink-500">
                <MapPin className="w-3 h-3" />
                <span className="text-xs font-medium">{weather.location}</span>
              </div>
            </div>
          ) : (
            <div className="text-right text-pink-400">
              <Cloud className="w-6 h-6 ml-auto mb-1" />
              <p className="text-xs">Weather unavailable</p>
            </div>
          )}
        </div>

        {/* Centered Time Display */}
        <div className="text-center">
          <div className="text-6xl lg:text-8xl font-mono font-bold bg-gradient-to-tr from-pink-200 via-pink-300 to-pink-200 tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] bg-clip-text text-transparent mb-2">
            {formatTime(time)}
          </div>
          
          <div className="text-2xl font-semibold text-pink-400 tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] mb-1 ">
            {getTimeOfDay()}
          </div>
          
          <div className="text-lg font-medium text-pink-500 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
            {formatDate(time)}
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 blur-xl" />
      </div>
    </div>
  );
};