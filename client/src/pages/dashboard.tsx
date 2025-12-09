// client/src/pages/dashboard.tsx

import { WeatherWidget } from "@/components/WeatherWidget";
import { OutfitRecommendation } from "@/components/OutfitRecommendation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
// 💡 افزودن: وارد کردن هوک آب و هوا و نوع وایب
import { useWeather } from "@/lib/weather-context";
import { WeatherVibe } from "@/lib/types";

export default function Dashboard() {
  const { t } = useTranslation();
  // 💡 ۱. دریافت داده‌های آب و هوا
  const { weather, loading: weatherLoading } = useWeather();

  // 💡 ۲. تابع تعیین وایب مورد نیاز بر اساس دمای فعلی
  const getRequiredVibe = (temp?: number): WeatherVibe | null => {
    if (temp === undefined) return null;

    if (temp < 10) return "Cold";
    if (temp >= 10 && temp < 20) return "Moderate";
    if (temp >= 20) return "Warm";

    return null;
  };

  // 💡 ۳. تعیین وایب مورد نیاز روز
  const requiredVibe = getRequiredVibe(weather?.currentTemp);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">
            {t("dashboard.greeting")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <Link href="/upload">
          <Button
            size="icon"
            className="rounded-full h-10 w-10 shadow-lg shadow-primary/20"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      <WeatherWidget />

      {/* 💡 ۴. ارسال وایب مورد نیاز به کامپوننت پیشنهاد استایل */}
      <OutfitRecommendation requiredVibe={requiredVibe} />
    </div>
  );
}
