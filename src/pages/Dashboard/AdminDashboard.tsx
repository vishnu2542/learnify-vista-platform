
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Award, Bell, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import SupabaseStatus from "@/components/SupabaseStatus";
import { useAuth } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.first_name}! Manage your platform and users.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-4 bg-primary/10">
                <Users className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <p className="text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-4 bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <p className="text-muted-foreground">Courses</p>
                <p className="text-3xl font-bold">57</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-4 bg-primary/10">
                <Award className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <p className="text-muted-foreground">Enrollments</p>
                <p className="text-3xl font-bold">876</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-4 bg-primary/10">
                <Bell className="h-6 w-6 text-primary"/>
              </div>
              <div>
                <p className="text-muted-foreground">Notifications</p>
                <p className="text-3xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Analytics chart will be displayed here</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">New Students</p>
                  <p className="text-2xl font-bold">+43%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Course Completions</p>
                  <p className="text-2xl font-bold">+27%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
                
                <div className="bg-muted/40 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">+18%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <SupabaseStatus />
          
          <div className="mt-6 space-y-4">
            <Button asChild className="w-full">
              <Link to="/admin/users">Manage Users</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/courses">Manage Courses</Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/reports">View Reports</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
