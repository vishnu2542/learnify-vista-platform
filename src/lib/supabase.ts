
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cpshmvszotztmtuouoyq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwc2htdnN6b3R6dG10dW91b3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NjIzMTksImV4cCI6MjA2MzAzODMxOX0.V1vNfJdKKK3q3796_GR8gqy61zOaOX9zid0x7k54TNU';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Initialize database procedures
export const initializeSupabaseFunctions = async () => {
  try {
    // Create RPC functions for table creation
    await supabase.rpc('setup_database_functions').then(result => {
      if (result.error) throw result.error;
    });

    return true;
  } catch (error: any) {
    console.error('Error initializing database functions:', error.message);
    toast({
      title: 'Database Error',
      description: 'Failed to initialize database functions. Please try again later.',
      variant: 'destructive',
    });
    return false;
  }
};

// Create the setup_database_functions function in Supabase
export const setupDatabaseSchema = async () => {
  try {
    const { error } = await supabase.from('_setup').select('*').limit(1);
    
    // If table doesn't exist, we need to create our functions
    if (error && error.code === '42P01') {
      // Create the setup function
      const createSetupFunction = `
        CREATE OR REPLACE FUNCTION setup_database_functions()
        RETURNS boolean
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          -- Create functions for each table
          CREATE OR REPLACE FUNCTION create_users_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              email TEXT UNIQUE NOT NULL,
              first_name TEXT,
              last_name TEXT,
              avatar_url TEXT,
              role TEXT DEFAULT 'student',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          -- Add other table creation functions
          CREATE OR REPLACE FUNCTION create_categories_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS categories (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_courses_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS courses (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              slug TEXT UNIQUE NOT NULL,
              description TEXT,
              instructor_id UUID REFERENCES users(id),
              price NUMERIC DEFAULT 0,
              level TEXT,
              thumbnail_url TEXT,
              is_published BOOLEAN DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_sections_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS sections (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
              position INTEGER NOT NULL DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_lectures_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS lectures (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              title TEXT NOT NULL,
              section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
              position INTEGER NOT NULL DEFAULT 0,
              type TEXT NOT NULL DEFAULT 'video',
              content TEXT,
              video_url TEXT,
              duration INTEGER, -- in seconds
              is_free BOOLEAN DEFAULT false,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_enrollments_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS enrollments (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
              enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, course_id)
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_progress_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS progress (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              lecture_id UUID REFERENCES lectures(id) ON DELETE CASCADE,
              completed BOOLEAN DEFAULT false,
              position INTEGER DEFAULT 0, -- video position in seconds
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, lecture_id)
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_ratings_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS ratings (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
              rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
              review TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, course_id)
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_cart_items_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS cart_items (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              UNIQUE(user_id, course_id)
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_orders_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS orders (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID REFERENCES users(id) ON DELETE CASCADE,
              total_amount NUMERIC NOT NULL DEFAULT 0,
              status TEXT NOT NULL DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          CREATE OR REPLACE FUNCTION create_order_items_table_if_not_exists()
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $inner$
          BEGIN
            CREATE TABLE IF NOT EXISTS order_items (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
              course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
              price NUMERIC NOT NULL DEFAULT 0,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            RETURN TRUE;
          END;
          $inner$;

          -- Create marker table to track if setup has been done
          CREATE TABLE IF NOT EXISTS _setup (
            id SERIAL PRIMARY KEY,
            completed BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          INSERT INTO _setup (completed) VALUES (true);
          
          RETURN TRUE;
        END;
        $$;
      `;
      
      await supabase.rpc('setup_database_functions');
      return true;
    }

    return true;
  } catch (error: any) {
    console.error('Error setting up database schema:', error.message);
    return false;
  }
};

// Initialize everything on app startup
setupDatabaseSchema();
