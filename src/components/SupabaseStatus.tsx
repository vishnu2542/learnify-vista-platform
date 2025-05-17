
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Database, User, BookOpen, Layout } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { seedDatabase } from "@/supabase/seed-data";

const SupabaseStatus = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [tableCount, setTableCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setStatus('loading');
      
      // Simple query to test connection
      const { error } = await supabase.from('users').select('count');
      
      if (error) {
        throw error;
      }
      
      setStatus('connected');
      fetchStats();
    } catch (error) {
      console.error('Supabase connection error:', error);
      setStatus('error');
    }
  };

  const fetchStats = async () => {
    try {
      // Get table count
      const { count: tableCountResult } = await supabase.rpc('get_table_count');
      setTableCount(tableCountResult || 0);
      
      // Get user count
      const { count: userCountResult } = await supabase.from('users').select('*', { count: 'exact', head: true });
      setUserCount(userCountResult);
      
      // Get course count
      const { count: courseCountResult } = await supabase.from('courses').select('*', { count: 'exact', head: true });
      setCourseCount(courseCountResult);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      await seedDatabase();
      toast.success("Database seeded successfully!");
      await fetchStats();
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase Connection Status
        </CardTitle>
        <CardDescription>
          Connection status to the Supabase backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Status:</span>
            {status === 'connected' && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" /> Connected
              </Badge>
            )}
            {status === 'loading' && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                Loading...
              </Badge>
            )}
            {status === 'error' && (
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <AlertCircle className="h-3 w-3 mr-1" /> Error
              </Badge>
            )}
          </div>
          
          {status === 'connected' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg flex flex-col items-center">
                <Layout className="h-6 w-6 mb-2 text-primary" />
                <span className="text-xl font-bold">{tableCount ?? '-'}</span>
                <span className="text-xs text-muted-foreground">Tables</span>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg flex flex-col items-center">
                <User className="h-6 w-6 mb-2 text-primary" />
                <span className="text-xl font-bold">{userCount ?? '-'}</span>
                <span className="text-xs text-muted-foreground">Users</span>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg flex flex-col items-center">
                <BookOpen className="h-6 w-6 mb-2 text-primary" />
                <span className="text-xl font-bold">{courseCount ?? '-'}</span>
                <span className="text-xs text-muted-foreground">Courses</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkConnection}>
          Refresh Status
        </Button>
        <Button onClick={handleSeedDatabase} disabled={seeding || status !== 'connected'}>
          {seeding ? "Seeding..." : "Seed Database"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseStatus;
