// client/src/lib/weather-context.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { WeatherVibe } from "./types"; // ✅ استفاده از آدرس نسبی و آکولاد
import { useToast } from "@/hooks/use-toast";

interface WeatherContextType {
      vibe: WeatherVibe;
      // ✅ اصلاح: اجازه undefined برای temp و locationName برای حل خطای نوع
      temp: number | undefined;
      locationName: string | undefined;
      isLoading: boolean;
      isError: boolean;
      refreshWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Default fallback (Tehran)
const DEFAULT_LAT = 35.6892;
const DEFAULT_LON = 51.389;

// 🛑🛑🛑 کلید API واقعی شما 🛑🛑🛑
const API_KEY = "6af996c2d896c8a52dba150da6218571";
export function WeatherProvider({ children }: { children: React.ReactNode }) {
      // ✅ اصلاح: تعریف state با undefined برای مطابقت با Interface
      const [temp, setTemp] = useState<number | undefined>(undefined);
      const [locationName, setLocationName] = useState<string | undefined>(
            undefined,
      );
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [isError, setIsError] = useState<boolean>(false);
      const { toast } = useToast();

      const getVibeFromTemp = (
            temperature: number | undefined,
      ): WeatherVibe => {
            if (temperature === undefined) return "Mild";
            if (temperature < 12) return "Cold";
            if (temperature > 24) return "Warm";
            return "Mild"; // ✅ Mild به جای Moderate
      };

      const vibe = getVibeFromTemp(temp);

      const fetchWeather = async (lat: number, lon: number) => {
            setIsLoading(true);
            setIsError(false);
            try {
                  const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
                  );

                  if (!response.ok) {
                        throw new Error(
                              "Failed to fetch weather data: API Key or server issue.",
                        );
                  }

                  const data = await response.json();
                  setTemp(Math.round(data.main.temp));
                  setLocationName(data.name);
            } catch (err: any) {
                  console.error("Weather fetch failed:", err);
                  setIsError(true);
                  toast({
                        title: "Weather Error",
                        description: `Could not fetch weather. Error: ${err.message || "Check API Key"}`,
                        variant: "destructive",
                  });
                  setTemp(undefined);
                  setLocationName(undefined);
            } finally {
                  setIsLoading(false);
            }
      };

      const getLocationAndFetch = () => {
            if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                        (position) => {
                              fetchWeather(
                                    position.coords.latitude,
                                    position.coords.longitude,
                              );
                        },
                        (err) => {
                              console.warn(
                                    "Geolocation denied or failed. Using fallback.",
                                    err,
                              );
                              fetchWeather(DEFAULT_LAT, DEFAULT_LON);
                        },
                  );
            } else {
                  console.warn("Geolocation not supported. Using fallback.");
                  fetchWeather(DEFAULT_LAT, DEFAULT_LON);
            }
      };

      useEffect(() => {
            getLocationAndFetch();
      }, []);

      return (
            <WeatherContext.Provider
                  value={{
                        vibe,
                        temp,
                        locationName,
                        isLoading,
                        isError,
                        refreshWeather: getLocationAndFetch,
                  }}
            >
                  {children}
            </WeatherContext.Provider>
      );
}

export function useWeather() {
      const context = useContext(WeatherContext);
      if (context === undefined) {
            throw new Error("useWeather must be used within a WeatherProvider");
      }
      return context;
}
