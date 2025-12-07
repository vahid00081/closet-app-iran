import { createClient } from "@supabase/supabase-js";

// مقادیر تضمین شده را مستقیماً وارد کنید
const supabaseUrl = "https://arfnuiudzqwxhdkqkhxg.supabase.co";
const supabaseAnonKey = "sb_publishable_0SImp7kIKbOiGKDYh8NN0A_slBbBLmk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// اگر از context API یا hook استفاده می‌کنید، ممکن است به exportهای بیشتری نیاز داشته باشید.
// اما این ساختار اصلی، اتصال را تضمین می‌کند.
