import { useWeather } from '@/lib/weather-context';
import { WEATHER_CONFIG, WeatherVibe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Cloud, Sun, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';

export function WeatherWidget() {
  const { vibe, temp, setVibe } = useWeather();

  const config = WEATHER_CONFIG[vibe];

  const icons = {
    Cold: Snowflake,
    Mild: Cloud,
    Warm: Sun,
  };

  const CurrentIcon = icons[vibe];

  return (
    <div className="w-full p-6 rounded-3xl bg-card border border-border shadow-lg relative overflow-hidden">
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-20 pointer-events-none", config.color.replace('text-', 'bg-'))} />
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Vibe</h2>
          <div className="flex items-center mt-2 gap-3">
            <CurrentIcon className={cn("w-8 h-8", config.color)} />
            <span className="text-4xl font-display font-bold">{temp}°C</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 font-medium">{config.label}</p>
        </div>

        <div className="flex flex-col gap-2">
          {(Object.keys(WEATHER_CONFIG) as WeatherVibe[]).map((v) => (
            <button
              key={v}
              onClick={() => setVibe(v)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all border border-transparent",
                vibe === v 
                  ? "bg-primary text-primary-foreground shadow-md scale-110" 
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:scale-105"
              )}
              aria-label={`Set weather to ${v}`}
            >
              <span className="text-[10px] font-bold">{v[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
