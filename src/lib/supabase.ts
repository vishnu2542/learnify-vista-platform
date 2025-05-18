
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
export const executeSQL = async (sql: string) => {
  try {
    // Using the rpc method to execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql function doesn't exist, handle the error
      console.log("SQL execution function not available yet:", error.message);
      
      // Try direct SQL execution through the REST API as fallback
      try {
        console.log("Attempting direct SQL execution...");
        // Note: This is a simplified approach and may not work in all Supabase environments
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`
          },
          body: JSON.stringify({ sql_query: sql })
        });
        
        if (!response.ok) {
          return { data: null, error: { message: "Failed to execute SQL directly" } };
        }
        
        const result = await response.json();
        return { data: result, error: null };
      } catch (directError) {
        console.error("Error executing SQL directly:", directError);
        return { data: null, error };
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    // Silently handle errors during initialization
    console.log("Error executing SQL:", error);
    return { data: null, error };
  }
};
