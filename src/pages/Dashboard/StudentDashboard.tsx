
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  CheckCircle,
  Clock,
  GraduationCap,
  Calendar,
  BarChart3,
  ChevronRight,
  Play,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import CourseGrid from "@/components/CourseGrid";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { enrolledCourses, courseProgress } = useCourses();

  // Get courses in progress and completed courses
  const coursesInProgress = enrolledCourses.filter(
    (course) => {
      const progress = courseProgress.find(
        (p) => p.course_id === course.id && p.user_id === user?.id
      );
      return progress && progress.progress_percentage < 100;
    }
  );

  const completedCourses = enrolledCourses.filter(
    (course) => {
      const progress = courseProgress.find(
        (p) => p.course_id === course.id && p.user_id === user?.id
      );
      return progress && progress.progress_percentage === 100;
    }
  );

  // Calculate overall progress
  const overallProgress = enrolledCourses.length > 0
    ? courseProgress.reduce((sum, p) => sum + p.progress_percentage, 0) / enrolledCourses.length
    : 0;

  // Get most recent course
  const recentCourse = enrolledCourses[0]; // In a real app, this would be based on last accessed timestamp
  const recentCourseProgress = recentCourse
    ? courseProgress.find(p => p.course_id === recentCourse.id)
    : undefined;

  // Mock data for activities and achievements
  const recentActivities = [
    {
      id: "1",
      title: "Completed lecture: Introduction to React Hooks",
      course: "Advanced React Development",
      time: "2 hours ago",
    },
    {
      id: "2",
      title: "Submitted quiz: CSS Fundamentals",
      course: "Introduction to Web Development",
      time: "Yesterday",
    },
    {
      id: "3",
      title: "Downloaded resource: UX Design Checklist",
      course: "UX/UI Design Fundamentals",
      time: "2 days ago",
    },
  ];

  const achievements = [
    {
      id: "1",
      title: "Fast Learner",
      description: "Completed 5 lectures in one day",
      icon: <GraduationCap className="h-8 w-8 text-amber-500" />,
    },
    {
      id: "2",
      title: "Early Bird",
      description: "Completed 3 courses before their deadlines",
      icon: <Calendar className="h-8 w-8 text-primary" />,
    },
    {
      id: "3",
      title: "Quiz Master",
      description: "Scored 100% on 5 quizzes",
      icon: <CheckCircle className="h-8 w-8 text-emerald-500" />,
    },
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Live Q&A Session",
      course: "Advanced React Development",
      date: "Tomorrow, 4:00 PM",
    },
    {
      id: "2",
      title: "Project Submission Deadline",
      course: "UX/UI Design Fundamentals",
      date: "Friday, 11:59 PM",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      {/* Greeting and stats */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Track your progress and continue learning
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Enrolled Courses</p>
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-amber-500/10">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold">{coursesInProgress.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">{completedCourses.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Continue learning section */}
      {recentCourse && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Continue Learning</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <img
                    src={recentCourse.thumbnail_url}
                    alt={recentCourse.title}
                    className="w-full sm:w-48 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      {recentCourse.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Instructor: {recentCourse.instructor_name}
                    </p>
                    
                    {recentCourseProgress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Your progress</span>
                          <span>{recentCourseProgress.progress_percentage}% complete</span>
                        </div>
                        <Progress value={recentCourseProgress.progress_percentage} className="h-2" />
                      </div>
                    )}
                    
                    <Button asChild>
                      <Link to={`/course/${recentCourse.id}/learn`}>
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/40 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Next up:</h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Building Your First Component</p>
                        <p className="text-xs text-muted-foreground">15:30 mins</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Play className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Understanding Props</p>
                        <p className="text-xs text-muted-foreground">12:45 mins</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Courses Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Courses</h2>
        <Tabs defaultValue="in-progress">
          <TabsList className="mb-4">
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress">
            {coursesInProgress.length > 0 ? (
              <CourseGrid
                courses={coursesInProgress}
                progress={courseProgress}
                enrolledCourseIds={enrolledCourses.map(c => c.id)}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You don't have any courses in progress.
                  </p>
                  <Button asChild>
                    <Link to="/explore">Explore Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
              <CourseGrid
                courses={completedCourses}
                progress={courseProgress}
                enrolledCourseIds={enrolledCourses.map(c => c.id)}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't completed any courses yet.
                  </p>
                  <Button asChild>
                    <Link to="/my-courses">Go to My Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all">
            {enrolledCourses.length > 0 ? (
              <CourseGrid
                courses={enrolledCourses}
                progress={courseProgress}
                enrolledCourseIds={enrolledCourses.map(c => c.id)}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't enrolled in any courses yet.
                  </p>
                  <Button asChild>
                    <Link to="/explore">Explore Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Grid of activity, achievements, and upcoming events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-medium">{activity.title}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>{activity.course}</p>
                    <p>{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View All Activity <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.course}</p>
                  <div className="flex items-center mt-1 text-sm">
                    <Calendar className="h-4 w-4 mr-1 text-primary" />
                    {event.date}
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View Calendar <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Achievements */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="border rounded-lg p-4 flex flex-col items-center text-center"
                >
                  <div className="mb-2">{achievement.icon}</div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="link">
                View All Achievements <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
