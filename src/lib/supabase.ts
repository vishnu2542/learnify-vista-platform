
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Use environment variables, but provide better fallback error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient<Database>(
  supabaseUrl || '',  // Provide empty string as fallback to prevent runtime errors
  supabaseAnonKey || ''
);

// Helper function to check if Supabase connection is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder'));
};
