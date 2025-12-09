import { createClient } from "@supabase/supabase-js";
import { ClothingItem } from "./types"; // برای تعریف نوع آیتم‌های کمد لباس

// 🛑🛑🛑 جایگزین شود: این آدرس‌ها را با مقادیر واقعی پروژه Supabase خود جایگزین کنید 🛑🛑🛑
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "YOUR_ACTUAL_SUPABASE_URL";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_ACTUAL_SUPABASE_ANON_KEY";
// ----------------------------------------------------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      "x-client-info": "vibe-closet-reinit",
    },
  },
});

/**
 * 💡 تابع حیاتی برای Dashboard: واکشی آیتم‌های کمد لباس کاربر فعلی
 * این تابع برای رفع خطای "has no exported member 'getClosetItems'" اضافه شد.
 */
export async function getClosetItems(): Promise<ClothingItem[]> {
  // ۱. اطمینان از وجود نشست کاربر
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (!user) {
    // اگر کاربر لاگین نکرده باشد، آرایه خالی برگردانده شود.
    return [];
  }

  // ۲. واکشی داده‌ها از جدول 'clothing_items'
  const { data, error } = await supabase
    .from("clothing_items") // نام جدول شما
    .select("*")
    .eq("user_id", user.id); // فیلتر بر اساس user_id

  if (error) {
    console.error("Error fetching closet items:", error);
    throw new Error(error.message);
  }

  // ۳. اطمینان از اینکه داده‌ها با نوع ClothingItem[] مطابقت دارند
  return (data || []) as ClothingItem[];
}
