import React, { createContext, useContext, useState, useEffect } from "react";
import { WeatherVibe } from "./types";
import { useToast } from "@/hooks/use-toast";

interface WeatherContextType {
  vibe: WeatherVibe;
  temp: number;
  locationName: string;
  isLoading: boolean;
  // 💡 اصلاح شده: مدیریت خطا به صورت boolean
  isError: boolean;
  refreshWeather: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Default fallback (Tehran)
const DEFAULT_LAT = 35.6892;
const DEFAULT_LON = 51.389;

// 🛑 توجه: شما باید این کلید را با کلید واقعی OpenWeatherMap خود جایگزین کنید 🛑
const API_KEY = "ca53465d9ef90a230e9ec169fbbb662a";

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const [temp, setTemp] = useState<number>(18);
  const [locationName, setLocationName] = useState<string>("Tehran");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 💡 اصلاح شده: استفاده از boolean
  const [isError, setIsError] = useState<boolean>(false);
  const { toast } = useToast();

  // Logic to determine vibe based on temperature
  const getVibeFromTemp = (temperature: number): WeatherVibe => {
    if (temperature < 12) return "Cold";
    if (temperature > 24) return "Warm";
    // Mild یا Moderate
    // فرض می‌کنیم Mild همان Moderate است مگر اینکه در types شما متفاوت تعریف شده باشد
    return "Moderate";
  };

  const vibe = getVibeFromTemp(temp);

  const fetchWeather = async (lat: number, lon: number) => {
    setIsLoading(true);
    // 💡 تنظیم مجدد خطا در شروع فراخوانی
    setIsError(false);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
      );

      if (!response.ok) {
        // اگر API کلید نامعتبر باشد یا مشکل دیگری پیش آید
        throw new Error(
          "Failed to fetch weather data: API Key or server issue.",
        );
      }

      const data = await response.json();
      setTemp(Math.round(data.main.temp));
      setLocationName(data.name);
    } catch (err: any) {
      console.error("Weather fetch failed:", err);
      // 💡 تنظیم خطا به true
      setIsError(true);
      toast({
        title: "Weather Error",
        description: `Could not fetch weather. Error: ${err.message || "Check API Key"}`,
        variant: "destructive",
      });
      // در صورت خطا، با مقادیر پیش‌فرض/آخرین مقادیر باقی می‌مانیم
    } finally {
      setIsLoading(false);
    }
  };

  const getLocationAndFetch = () => {
    // تلاش برای دریافت موقعیت مکانی
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation denied or failed. Using fallback.", err);
          // در صورت رد دسترسی یا خطا، از مقادیر پیش‌فرض استفاده کن
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
        // 💡 نام متغیر تصحیح شد
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
