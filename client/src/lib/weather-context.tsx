import React, { createContext, useContext, useState } from 'react';
import { WeatherVibe, WEATHER_CONFIG } from './types';

interface WeatherContextType {
  vibe: WeatherVibe;
  temp: number;
  setVibe: (vibe: WeatherVibe) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [vibe, setVibe] = useState<WeatherVibe>('Mild');

  const temp = WEATHER_CONFIG[vibe].temp;

  return (
    <WeatherContext.Provider value={{ vibe, temp, setVibe }}>
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
