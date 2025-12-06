export type WeatherVibe = 'Cold' | 'Mild' | 'Warm';

export type ClothingType = 'Top' | 'Bottom' | 'Shoes' | 'Accessory';

export type ClothingItem = {
  id: string;
  imageUrl: string;
  type: ClothingType;
  weatherTags: WeatherVibe[];
  createdAt: number;
  imagePath?: string; // Path in Supabase Storage bucket (for deletion)
};

export const WEATHER_CONFIG = {
  Cold: { temp: 5, label: 'Cold', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  Mild: { temp: 18, label: 'Mild', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  Warm: { temp: 30, label: 'Warm', color: 'text-orange-400', bg: 'bg-orange-500/10' },
} as const;
