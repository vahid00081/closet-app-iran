import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arfnuiudzqwxhdkqkhxg.supabase.co';
const supabaseAnonKey = 'sb_publishable_0SImp7kIKbOiGKDYh8NN0A_slBbBLmk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
