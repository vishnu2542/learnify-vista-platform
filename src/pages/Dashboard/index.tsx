
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminDashboard from "./AdminDashboard";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log when dashboard is accessed
    if (user) {
      console.log(`Dashboard accessed by ${user.role} user: ${user.email}`);
    }
  }, [user]);
  
  // Add function to initialize database schema
  const initializeDatabase = async () => {
    if (user?.role === 'admin') {
      console.log("Admin user detected, checking if database needs seeding...");
      console.log("Starting database seeding process...");
      
      try {
        // Create users table
        await supabase.rpc('create_users_table_if_not_exists').catch(() => {
          // Create users table manually if RPC doesn't exist
          return supabase.query(`
            CREATE TABLE IF NOT EXISTS public.users (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              email TEXT UNIQUE NOT NULL,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              avatar_url TEXT,
              role TEXT NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `);
        });
        
        // Create courses table with proper foreign key
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.courses (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            thumbnail_url TEXT NOT NULL,
            instructor_id UUID NOT NULL REFERENCES public.users(id),
            price NUMERIC,
            level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all-levels')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            published BOOLEAN DEFAULT FALSE,
            featured BOOLEAN DEFAULT FALSE,
            total_lectures INTEGER DEFAULT 0,
            duration TEXT,
            category_id UUID,
            total_students INTEGER DEFAULT 0,
            rating NUMERIC,
            total_reviews INTEGER DEFAULT 0
          );
        `);
        
        // Create categories table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // Create course_sections table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.course_sections (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            order INTEGER NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // Create course_lectures table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.course_lectures (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            video_url TEXT,
            duration TEXT,
            order INTEGER NOT NULL,
            is_free BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        // Create course_enrollments table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.course_enrollments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
            enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            completed_at TIMESTAMP WITH TIME ZONE,
            UNIQUE(course_id, user_id)
          );
        `);

        // Create course_progress table
        await supabase.query(`
          CREATE TABLE IF NOT EXISTS public.course_progress (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
            course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
            completed_lectures TEXT[] DEFAULT '{}',
            progress_percentage NUMERIC DEFAULT 0,
            last_watched_lecture UUID,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
        
        // Create function to increment course students
        await supabase.query(`
          CREATE OR REPLACE FUNCTION increment_course_students(course_id UUID, increment_by INTEGER)
          RETURNS VOID AS $$
          BEGIN
            UPDATE courses
            SET total_students = COALESCE(total_students, 0) + increment_by
            WHERE id = course_id;
          END;
          $$ LANGUAGE plpgsql;
        `);
        
        console.log("Database structure setup completed");
        
      } catch (error) {
        console.error("Error initializing database:", error);
        toast.error("Failed to initialize database structure");
      }
    }
  };
  
  useEffect(() => {
    if (user?.role === 'admin') {
      initializeDatabase();
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location.pathname }} />;
  }

  // Render dashboard based on user role
  console.log(`Rendering dashboard for role: ${user.role}`);
  
  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-7xl p-4 md:p-6"
        >
          <h1 className="text-3xl font-bold mb-4">Welcome to EduFlow</h1>
          <p className="mb-4">Your role ({user.role || "unknown"}) doesn't have a specific dashboard yet.</p>
          <p>Please contact an administrator for assistance.</p>
        </motion.div>
      );
  }
};

export default Dashboard;
