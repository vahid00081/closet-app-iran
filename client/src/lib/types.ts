// client/src/lib/types.ts

// ✅ اصلاح خطای "is not exported": اضافه شدن export
export type WeatherVibe = "Cold" | "Mild" | "Warm";

export type ClothingType = "Top" | "Bottom" | "Shoes" | "Accessory";

// یک نوع پایه برای آیتم‌های کمد لباس
export type ClothingItem = {
  id: string;
  imageUrl: string;
  type: ClothingType;
  // از WeatherVibe که در بالا تعریف شده، استفاده می‌کند
  weatherTags: WeatherVibe[];
  createdAt: number;
  imagePath?: string;
};

// کانفیگ برای ویجت آب و هوا
export const WEATHER_CONFIG = {
  Cold: {
    temp: 5,
    label: "Cold",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  Mild: {
    temp: 18,
    label: "Mild",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  Warm: {
    temp: 30,
    label: "Warm",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
} as const;
