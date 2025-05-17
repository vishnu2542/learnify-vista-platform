
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!supabaseUrl.includes('supabase.co') || supabaseAnonKey === 'placeholder-key') {
  console.error('Missing Supabase credentials. Check your env variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
