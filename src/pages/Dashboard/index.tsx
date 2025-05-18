
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();
  
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
      return (
        <div className="container mx-auto max-w-7xl p-4 md:p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to EduFlow</h1>
          <p className="mb-4">Your role ({user.role || "unknown"}) doesn't have a specific dashboard yet.</p>
          <p>Please contact an administrator for assistance.</p>
        </div>
      );
  }
};

export default Dashboard;
