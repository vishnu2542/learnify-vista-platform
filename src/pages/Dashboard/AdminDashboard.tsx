
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, BookOpen, Users, Calendar, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";
import SupabaseStatus from "@/components/SupabaseStatus";
import AdminStats from "@/components/AdminStats";
import { useAuth } from "@/context/AuthContext";
import { seedDatabase } from "@/supabase/seed-data";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for the charts
  const courseCompletionData = [
    { name: "Web Dev", completed: 75, ongoing: 25 },
    { name: "Data Science", completed: 45, ongoing: 55 },
    { name: "UI/UX", completed: 60, ongoing: 40 },
    { name: "Mobile Dev", completed: 30, ongoing: 70 },
    { name: "Business", completed: 85, ongoing: 15 },
  ];
  
  const recentActivity = [
    { id: 1, user: "Emma Wilson", action: "Started course", course: "Python for Data Science", time: "2 hours ago" },
    { id: 2, user: "John Smith", action: "Created course", course: "Advanced JavaScript", time: "5 hours ago" },
    { id: 3, user: "Alex Johnson", action: "Completed quiz", course: "UX/UI Design Fundamentals", time: "Yesterday" },
    { id: 4, user: "Sarah Miller", action: "Enrolled", course: "Business Analytics", time: "Yesterday" },
    { id: 5, user: "Michael Brown", action: "Left review", course: "Mobile App Development", time: "2 days ago" },
  ];
  
  // Fetch upcoming events
  const { data: events = [] } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      // Mock data for now - would fetch from API in real app
      return [
        { id: 1, title: "New Course Launch", date: "2025-05-25", type: "launch" },
        { id: 2, title: "Webinar: Advanced React", date: "2025-05-30", type: "webinar" },
        { id: 3, title: "End of Month Review", date: "2025-05-31", type: "meeting" },
        { id: 4, title: "Summer Course Planning", date: "2025-06-05", type: "planning" },
      ];
    },
  });
  
  useEffect(() => {
    // Seed database on first load for admin user
    async function initializeData() {
      try {
        if (user && user.role === 'admin') {
          console.log("Admin user detected, checking if database needs seeding...");
          await seedDatabase();
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        toast.error("Failed to initialize database data");
      }
    }
    
    initializeData();
  }, [user]);

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="container mx-auto max-w-7xl p-4 md:p-6"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.first_name}! Manage your platform and users.
        </p>
      </motion.div>
      
      <AdminStats />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <motion.div 
            variants={item}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Course Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={courseCompletionData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" stackId="a" fill="#7c3aed" />
                        <Bar dataKey="ongoing" stackId="a" fill="#d4d4d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="bg-muted/40 p-4 rounded-lg border-l-4 border-primary"
                    >
                      <p className="text-sm text-muted-foreground">New Students</p>
                      <p className="text-2xl font-bold">+43%</p>
                      <p className="text-xs text-muted-foreground">vs last month</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="bg-muted/40 p-4 rounded-lg border-l-4 border-primary"
                    >
                      <p className="text-sm text-muted-foreground">Course Completions</p>
                      <p className="text-2xl font-bold">+27%</p>
                      <p className="text-xs text-muted-foreground">vs last month</p>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.03 }}
                      className="bg-muted/40 p-4 rounded-lg border-l-4 border-primary"
                    >
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">+18%</p>
                      <p className="text-xs text-muted-foreground">vs last month</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <SupabaseStatus />
              
              <motion.div 
                variants={item}
                className="mt-6 space-y-4"
              >
                <Button asChild className="w-full transition-all hover:translate-y-[-2px] hover:shadow-md">
                  <Link to="/admin/users">Manage Users</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full transition-all hover:translate-y-[-2px] hover:shadow-md">
                  <Link to="/admin/courses">Manage Courses</Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full transition-all hover:translate-y-[-2px] hover:shadow-md">
                  <Link to="/admin/reports">View Reports</Link>
                </Button>
              </motion.div>
              
              <motion.div variants={item} className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {events.slice(0, 3).map((event) => (
                      <motion.div 
                        key={event.id}
                        className="flex items-start gap-3 border-b pb-2 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="rounded-full p-2 bg-primary/10">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.date}</p>
                        </div>
                      </motion.div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      View all events
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <motion.div 
                      key={activity.id}
                      className="flex items-start border-b pb-3 last:border-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="rounded-full p-2 mr-3 bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span> {activity.course}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="courses">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage your platform's courses and content.</p>
                <div className="bg-muted/40 p-6 rounded-lg text-center">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Course Analytics Dashboard</h3>
                  <p className="mb-4 text-muted-foreground">View detailed analytics for all courses</p>
                  <Button>View Courses</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="users">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage your platform's users and instructors.</p>
                <div className="bg-muted/40 p-6 rounded-lg text-center">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">User Analytics Dashboard</h3>
                  <p className="mb-4 text-muted-foreground">View detailed analytics for all users</p>
                  <Button>View Users</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Manage your platform's schedule and events.</p>
                <div className="bg-muted/40 p-6 rounded-lg text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Schedule Dashboard</h3>
                  <p className="mb-4 text-muted-foreground">View and manage all scheduled events</p>
                  <Button>View Schedule</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminDashboard;
