
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Award, Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
}

const StatsCard = ({ icon, title, value }: StatsCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center">
        <div className="rounded-full p-3 mr-4 bg-primary/10">
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminStats = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [enrollmentCount, setEnrollmentCount] = useState<number>(0);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        icon={<Users className="h-6 w-6 text-primary"/>}
        title="Total Users"
        value={isLoading ? "Loading..." : userCount}
      />
      
      <StatsCard
        icon={<BookOpen className="h-6 w-6 text-primary"/>}
        title="Courses"
        value={isLoading ? "Loading..." : courseCount}
      />
      
      <StatsCard
        icon={<Award className="h-6 w-6 text-primary"/>}
        title="Enrollments"
        value={isLoading ? "Loading..." : enrollmentCount}
      />
      
      <StatsCard
        icon={<Bell className="h-6 w-6 text-primary"/>}
        title="Notifications"
        value={isLoading ? "Loading..." : notificationCount}
      />
    </div>
  );
};

export default AdminStats;
