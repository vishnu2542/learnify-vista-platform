
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Use your provided Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpshmvszotztmtuouoyq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwc2htdnN6b3R6dG10dW91b3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjIzMTksImV4cCI6MjA2MzAzODMxOX0.V1vNfJdKKK3q3796_GR8gqy61zOaOX9zid0x7k54TNU';

console.log('Initializing Supabase with:', supabaseUrl.substring(0, 15) + '...');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase connection is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper function to execute raw SQL (for database initialization)
supabase.query = async (sql: string) => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // If exec_sql function doesn't exist, we'll handle it silently
      // This would happen before our database is fully set up
      console.log("SQL execution function not available yet");
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    // Silently handle errors during initialization
    console.log("Error executing SQL:", error);
    return { data: null, error };
  }
};
