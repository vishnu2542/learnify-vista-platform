
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  
  useEffect(() => {
    // Initialize database tables and relationships if admin
    const initializeDatabase = async () => {
      if (user?.role === 'admin' && !isInitializing) {
        setIsInitializing(true);
        
        try {
          // Create users table if it doesn't exist
          await supabase.rpc('create_users_table_if_not_exists')
            .then(res => {
              if (res.error) throw res.error;
            });
          
          // Create categories table
          await supabase.rpc('create_categories_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create courses table
          await supabase.rpc('create_courses_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create sections table
          await supabase.rpc('create_sections_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create lectures table
          await supabase.rpc('create_lectures_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create enrollments table
          await supabase.rpc('create_enrollments_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create progress tracking table
          await supabase.rpc('create_progress_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create ratings table
          await supabase.rpc('create_ratings_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create cart_items table
          await supabase.rpc('create_cart_items_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create orders table
          await supabase.rpc('create_orders_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
          // Create order_items table
          await supabase.rpc('create_order_items_table_if_not_exists').then(res => {
            if (res.error) throw res.error;
          });
          
        } catch (error: any) {
          console.error('Error initializing database:', error.message);
          toast({
            title: 'Database Error',
            description: 'Failed to initialize database tables. Please try again later.',
            variant: 'destructive',
          });
        } finally {
          setIsInitializing(false);
        }
      }
    };
    
    initializeDatabase();
  }, [user]);
  
  if (!user) {
    return null; // Will be redirected by auth context
  }
  
  return (
    <div className="container py-8">
      {user.role === 'admin' ? (
        <AdminDashboard />
      ) : user.role === 'instructor' ? (
        <InstructorDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  );
};

export default Dashboard;
