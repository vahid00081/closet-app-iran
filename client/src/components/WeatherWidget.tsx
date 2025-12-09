// client/src/components/WeatherWidget.tsx

import { useWeather } from "@/lib/weather-context";
import { WEATHER_CONFIG } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Cloud,
  Sun,
  Snowflake,
  MapPin,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react"; // 💡 افزودن AlertTriangle
import { useTranslation } from "react-i18next";

export function WeatherWidget() {
  // 💡 اضافه کردن متغیر 'isError' برای مدیریت خطای موقعیت/API
  const { vibe, temp, locationName, isLoading, refreshWeather, isError } =
    useWeather();
  const { t } = useTranslation();

  // اطمینان حاصل می‌کنیم که vibe یک مقدار معتبر دارد (یا Cold/Mild/Warm یا یک مقدار پیش‌فرض اگر null باشد)
  const currentVibe = vibe || "Mild";
  const config = WEATHER_CONFIG[currentVibe];

  const icons = {
    Cold: Snowflake,
    Moderate: Cloud, // 💡 احتمالاً در فایل types شما Mild به Moderate تغییر کرده
    Warm: Sun,
  };

  const CurrentIcon = icons[currentVibe as keyof typeof icons];

  // 💡 مدیریت حالت خطا یا عدم وجود داده
  const hasData = temp !== undefined && locationName;
  const showErrorMessage = (!isLoading && isError) || (!isLoading && !hasData);

  return (
    <div className="w-full p-6 rounded-3xl bg-card border border-border shadow-lg relative overflow-hidden group">
      {/* Background Blur Effect */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full opacity-20 pointer-events-none transition-colors duration-1000",
          config.color.replace("text-", "bg-"),
        )}
      />

      <div className="flex justify-between items-start relative z-10">
        {/* 💡 نمایش پیام خطا در صورت عدم وجود داده */}
        {showErrorMessage ? (
          <div className="py-2">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">
                {t("weather.error_title")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("weather.error_location")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("weather.check_permissions")}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <MapPin size={12} />
              <span className="text-xs font-medium uppercase tracking-wider">
                {isLoading ? t("weather.loading_location") : locationName}
              </span>
            </div>

            <div className="flex items-center mt-2 gap-3">
              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <CurrentIcon
                  className={cn(
                    "w-8 h-8 transition-colors duration-500",
                    config.color,
                  )}
                />
              )}

              <span className="text-4xl font-display font-bold tabular-nums">
                {isLoading ? "--" : temp}°C
              </span>
            </div>

            <p
              className={cn(
                "text-sm mt-1 font-medium transition-colors duration-500",
                isLoading ? "text-muted-foreground" : config.color,
              )}
            >
              {isLoading
                ? t("weather.updating")
                : t("weather.feels", {
                    vibe: t(`weather.${currentVibe.toLowerCase()}`),
                  })}
            </p>
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex flex-col gap-2">
          <button
            onClick={refreshWeather}
            disabled={isLoading}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95 disabled:opacity-50"
            aria-label="Refresh weather"
          >
            <RefreshCw size={14} className={cn(isLoading && "animate-spin")} />
          </button>
        </div>
      </div>
    </div>
  );
}
