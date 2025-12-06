import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arfnuiudzqwxhdkqkhxg.supabase.co';
const supabaseAnonKey = 'sb_publishable_0SImp7kIKbOiGKDYh8NN0A_slBbBLmk';

// Force fresh instance configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  // Add global headers to avoid caching if possible (though primarily browser side)
  global: {
    headers: {
      'x-client-info': 'vibe-closet-reinit',
    },
  },
});
