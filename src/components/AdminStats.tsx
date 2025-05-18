
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award, Bell, TrendingUp, Target } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend?: number;
  delay?: number;
}

const StatsCard = ({ icon, title, value, trend, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <Card className="overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center">
          <div className="rounded-full p-3 mr-4 bg-primary/10">
            {icon}
          </div>
          <div>
            <p className="text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center mt-1">
                <TrendingUp className={`h-4 w-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'} mr-1`} />
                <span className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {trend > 0 ? '+' : ''}{trend}% vs last month
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AdminStats = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trends, setTrends] = useState({
    users: 43,
    courses: 12,
    enrollments: 27,
    notifications: 18
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        
        // Fetch user count
        const { count: userCountRes, error: userError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (!userError) setUserCount(userCountRes || 0);
        
        // Fetch course count
        const { count: courseCountRes, error: courseError } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });
          
        if (!courseError) setCourseCount(courseCountRes || 0);
        
        // Fetch enrollment count
        const { count: enrollmentCountRes, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select('*', { count: 'exact', head: true });
          
        if (!enrollmentError) setEnrollmentCount(enrollmentCountRes || 0);
        
        // For notifications, we'll just use a placeholder for now
        setNotificationCount(12);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      <StatsCard
        icon={<Users className="h-6 w-6 text-primary"/>}
        title="Total Users"
        value={isLoading ? "Loading..." : userCount}
        trend={trends.users}
        delay={1}
      />
      
      <StatsCard
        icon={<BookOpen className="h-6 w-6 text-primary"/>}
        title="Courses"
        value={isLoading ? "Loading..." : courseCount}
        trend={trends.courses}
        delay={2}
      />
      
      <StatsCard
        icon={<Award className="h-6 w-6 text-primary"/>}
        title="Enrollments"
        value={isLoading ? "Loading..." : enrollmentCount}
        trend={trends.enrollments}
        delay={3}
      />
      
      <StatsCard
        icon={<Bell className="h-6 w-6 text-primary"/>}
        title="Notifications"
        value={isLoading ? "Loading..." : notificationCount}
        trend={trends.notifications}
        delay={4}
      />
    </motion.div>
  );
};

export default AdminStats;
