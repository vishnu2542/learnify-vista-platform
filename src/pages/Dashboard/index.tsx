
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminDashboard from "./AdminDashboard";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Log when dashboard is accessed
    if (user) {
      console.log(`Dashboard accessed by ${user.role} user: ${user.email}`);
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
    return <Navigate to="/signin" />;
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
