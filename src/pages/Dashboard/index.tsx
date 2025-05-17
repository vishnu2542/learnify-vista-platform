
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminDashboard from "./AdminDashboard";
import { seedDatabase } from "@/supabase/seed-data";

const Dashboard = () => {
  const { user, loading } = useAuth();
  
  // Seed database on first load (this would be removed in production)
  useEffect(() => {
    if (user && user.role === 'admin') {
      seedDatabase().catch(console.error);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "student":
      return <StudentDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <Navigate to="/" />;
  }
};

export default Dashboard;
