import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherVibe } from './types';
import { useToast } from '@/hooks/use-toast';

interface WeatherContextType {
  vibe: WeatherVibe;
  temp: number;
  locationName: string;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Default fallback (Tehran)
const DEFAULT_LAT = 35.6892;
const DEFAULT_LON = 51.3890;
const API_KEY = '6af996c2d896c8a52dba150da6218571';

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [temp, setTemp] = useState<number>(18);
  const [locationName, setLocationName] = useState<string>('Tehran');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Logic to determine vibe based on temperature
  const getVibeFromTemp = (temperature: number): WeatherVibe => {
    if (temperature < 12) return 'Cold';
    if (temperature > 24) return 'Warm';
    return 'Mild';
  };

  const vibe = getVibeFromTemp(temp);

  const fetchWeather = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setTemp(Math.round(data.main.temp));
      setLocationName(data.name);
    } catch (err) {
      console.error(err);
      setError('Could not fetch weather');
      toast({ 
        title: "Weather Error", 
        description: "Using default location (Tehran)",
        variant: "destructive" 
      });
      // Fallback to defaults if not already set? 
      // Actually we keep whatever state we have, but maybe reset to defaults if it's the first load?
      // Let's just keep the error state.
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      fetchWeather(DEFAULT_LAT, DEFAULT_LON);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.warn("Geolocation denied or failed", err);
        fetchWeather(DEFAULT_LAT, DEFAULT_LON);
      }
    );
  };

  useEffect(() => {
    getLocationAndFetch();
  }, []);

  return (
    <WeatherContext.Provider value={{ 
      vibe, 
      temp, 
      locationName, 
      isLoading, 
      error,
      refreshWeather: getLocationAndFetch 
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
