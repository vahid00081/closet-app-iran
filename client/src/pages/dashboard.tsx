// client/src/pages/dashboard.tsx

import { WeatherWidget } from "@/components/WeatherWidget";
import { OutfitRecommendation } from "@/components/OutfitRecommendation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react"; 
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useWeather } from "@/lib/weather-context";
import { WeatherVibe, ClothingItem } from "@/lib/types"; 

// ✅ اصلاح آدرس‌دهی: فرض می‌کنیم نام فایل supabase.ts است
import { useQuery } from '@tanstack/react-query';
import { getClosetItems } from '@/lib/supabase'; 

export default function Dashboard() {
const { t } = useTranslation();

// ✅ اصلاح: استفاده صحیح از متغیرهای هوک useWeather
const { temp, isLoading: weatherLoading, isError: weatherError } = useWeather();

// 💡 دریافت داده‌های کمد لباس و مدیریت بارگذاری آن
const {
data: closetItems,
isLoading: closetLoading,
isError: closetError,
} = useQuery<ClothingItem[]>({
queryKey: ['closetItems'],
queryFn: getClosetItems, 
});

const getRequiredVibe = (temperature: number | undefined): WeatherVibe | null => {
if (temperature === undefined) return null;

if (temperature < 12) return "Cold";
if (temperature >= 12 && temperature < 25) return "Mild"; 
if (temperature >= 25) return "Warm";

return null;
};

const requiredVibe = getRequiredVibe(temp);

// ✅ مدیریت بارگذاری: نمایش لودر جامع (حل مشکل صفحه سیاه)
if (weatherLoading || closetLoading) {
return (
<div className="min-h-screen flex items-center justify-center">
<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
</div>
);
}

if (weatherError || closetError) {
return (
<div className="p-4 text-center text-red-600">
{t("dashboard.error")}
</div>
);
}

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

<OutfitRecommendation 
requiredVibe={requiredVibe} 
closetItems={closetItems || []} // اطمینان از ارسال آرایه خالی در صورت undefined بودن
/>
</div>
);
}