
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Pencil,
  Plus,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockCourses } from "@/data/mockData";

const InstructorDashboard = () => {
  const { user } = useAuth();
  
  // Get instructor courses
  const instructorCourses = mockCourses.filter(
    (course) => course.instructor_id === user?.id
  );
  
  // Mock data for instructor analytics
  const analytics = {
    totalStudents: 2541,
    totalRevenue: 15240.50,
    averageRating: 4.7,
    totalCourses: instructorCourses.length,
    courseCompletionRate: 68,
    studentGrowth: 12.5, // percentage increase
    revenueGrowth: -3.2, // percentage decrease
    topCourse: instructorCourses[0]?.title || "No courses yet",
  };
  
  // Mock data for recent reviews
  const recentReviews = [
    {
      id: "1",
      courseName: "Advanced React Development",
      studentName: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      comment: "Exceptional course! The instructor explained complex concepts clearly and provided relevant examples.",
      date: "2 days ago",
    },
    {
      id: "2",
      courseName: "Introduction to Web Development",
      studentName: "Jamie Smith",
      avatar: null,
      rating: 4,
      comment: "Great introduction to web development. Would have liked more exercises, but overall very satisfied.",
      date: "1 week ago",
    },
    {
      id: "3",
      courseName: "Advanced React Development",
      studentName: "Taylor Wilson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1561&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 5,
      comment: "This course took my React skills to the next level. The projects were challenging but very educational.",
      date: "2 weeks ago",
    },
  ];
  
  // Mock data for upcoming tasks
  const upcomingTasks = [
    {
      id: "1",
      title: "Record new lectures for React course",
      dueDate: "Tomorrow",
      priority: "high",
    },
    {
      id: "2",
      title: "Update course materials for Web Development",
      dueDate: "Next week",
      priority: "medium",
    },
    {
      id: "3",
      title: "Review student submissions",
      dueDate: "Today",
      priority: "high",
    },
  ];
  
  // Mock data for student questions
  const studentQuestions = [
    {
      id: "1",
      student: "Chris Lee",
      avatar: null,
      question: "Could you explain the difference between props and state in React?",
      course: "Advanced React Development",
      date: "3 hours ago",
    },
    {
      id: "2",
      student: "Morgan Taylor",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      question: "I'm having trouble with the CSS grid assignment. Can you provide additional resources?",
      course: "Introduction to Web Development",
      date: "1 day ago",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      {/* Greeting and key metrics */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-muted-foreground mb-6">
          Here's what's happening with your courses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Students</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{analytics.totalStudents}</p>
                  <span className="text-xs flex items-center text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {analytics.studentGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-emerald-500/10">
                <DollarSign className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Revenue</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                  <span className="text-xs flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {Math.abs(analytics.revenueGrowth)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-amber-500/10">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Average Rating</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold">{analytics.averageRating}</p>
                  <div className="flex text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Course Completion</p>
                <p className="text-3xl font-bold">{analytics.courseCompletionRate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Course Management Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <Button asChild>
            <Link to="/create-course">
              <Plus className="h-4 w-4 mr-1" />
              Create New Course
            </Link>
          </Button>
        </div>
        
        {instructorCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instructorCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-1">{course.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.total_students || 0} students</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      <span>{course.rating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.total_lectures || 0} lectures</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" asChild className="flex-1">
                      <Link to={`/course/${course.id}/manage`}>Manage</Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link to={`/course/${course.id}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                You haven't created any courses yet.
              </p>
              <Button asChild>
                <Link to="/create-course">Create Your First Course</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Instructor Analytics and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Student growth chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Student Enrollment</CardTitle>
            <CardDescription>Student growth over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Analytics chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <div className={`rounded-full w-2 h-2 mt-2 ${
                      task.priority === "high" ? "bg-red-500" : 
                      task.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View All Tasks <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Reviews and Student Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y space-y-4">
              {recentReviews.map((review) => (
                <li key={review.id} className="pt-4 first:pt-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={review.avatar || undefined} />
                        <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.studentName}</p>
                        <p className="text-xs text-muted-foreground">{review.courseName}</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View All Reviews <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Student Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Student Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y space-y-4">
              {studentQuestions.map((question) => (
                <li key={question.id} className="pt-4 first:pt-0">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={question.avatar || undefined} />
                      <AvatarFallback>{question.student.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <p className="font-medium">{question.student}</p>
                        <p className="text-xs text-muted-foreground">{question.date}</p>
                      </div>
                      <p className="text-sm mt-1">{question.question}</p>
                      <p className="text-xs text-muted-foreground mt-1">Course: {question.course}</p>
                      <Button size="sm" variant="link" className="px-0 py-0 h-auto text-sm mt-1">
                        Reply
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View All Questions <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorDashboard;
