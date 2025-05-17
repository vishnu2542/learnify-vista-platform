
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  ArrowUp,
  ArrowDown,
  CheckSquare,
  AlertTriangle,
  Flag,
  User,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockCourses, mockUsers } from "@/data/mockData";

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // Mock platform analytics
  const analytics = {
    totalUsers: 10432,
    totalCourses: mockCourses.length,
    totalRevenue: 245890.75,
    totalInstructors: 52,
    activeUsers: 7865,
    userGrowth: 5.2,
    revenueGrowth: 12.8,
    courseGrowth: 3.5,
  };
  
  // Mock data for recent activities
  const recentActivities = [
    {
      id: "1",
      action: "New course published",
      user: "Jordan Teacher",
      details: "Advanced Python Programming",
      time: "2 hours ago",
    },
    {
      id: "2",
      action: "Course reported",
      user: "Alex Student",
      details: "Introduction to Web Development",
      time: "5 hours ago",
    },
    {
      id: "3",
      action: "New instructor registered",
      user: "Casey Wilson",
      details: "Account pending approval",
      time: "Yesterday",
    },
    {
      id: "4",
      action: "User requested refund",
      user: "Morgan Lee",
      details: "UX/UI Design Fundamentals",
      time: "2 days ago",
    },
  ];
  
  // Mock data for pending reviews
  const pendingApprovals = [
    {
      id: "1",
      type: "course",
      title: "Machine Learning Fundamentals",
      instructor: "Riley Johnson",
      submittedDate: "3 days ago",
    },
    {
      id: "2",
      type: "instructor",
      title: "New Instructor Application",
      instructor: "Jamie Smith",
      submittedDate: "1 week ago",
    },
    {
      id: "3",
      type: "payout",
      title: "Instructor Payout Request",
      instructor: "Taylor Wilson",
      amount: "$1,245.80",
      submittedDate: "2 days ago",
    },
  ];
  
  // Mock data for reported content
  const reportedContent = [
    {
      id: "1",
      contentType: "course",
      title: "JavaScript Basics",
      reportReason: "Outdated content",
      reportedBy: "Multiple users",
      reportCount: 5,
      date: "3 days ago",
    },
    {
      id: "2",
      contentType: "review",
      title: "Negative review on Python Course",
      reportReason: "Inappropriate language",
      reportedBy: "Jordan Teacher",
      reportCount: 1,
      date: "Yesterday",
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      {/* Greeting and key metrics */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mb-6">
          Platform overview and management
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Users</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
                  <span className="text-xs flex items-center text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {analytics.userGrowth}%
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
                  <span className="text-xs flex items-center text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {analytics.revenueGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-amber-500/10">
                <BookOpen className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Courses</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{analytics.totalCourses}</p>
                  <span className="text-xs flex items-center text-emerald-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    {analytics.courseGrowth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="rounded-full p-3 bg-blue-500/10">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Analytics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New user registrations over time</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">User growth chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Content Management and Approval Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Recent Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {recentActivities.map((activity) => (
                <li key={activity.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm">{activity.details}</p>
                      <p className="text-xs text-muted-foreground">By: {activity.user}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0">
              View All Activities <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
        
        {/* Items Needing Attention */}
        <Card>
          <CardHeader>
            <CardTitle>Requires Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Pending Approvals</h4>
                </div>
                <p className="text-2xl font-bold mt-2">{pendingApprovals.length}</p>
                <Button size="sm" variant="outline" className="mt-2" asChild>
                  <Link to="/admin/approvals">Review</Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  <h4 className="font-medium">Reported Content</h4>
                </div>
                <p className="text-2xl font-bold mt-2">{reportedContent.length}</p>
                <Button size="sm" variant="outline" className="mt-2" asChild>
                  <Link to="/admin/reports">Review</Link>
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Payout Requests</h4>
                </div>
                <p className="text-2xl font-bold mt-2">3</p>
                <Button size="sm" variant="outline" className="mt-2" asChild>
                  <Link to="/admin/payouts">Process</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Management */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          <Button asChild>
            <Link to="/admin/users">View All Users</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Students</CardTitle>
              <CardDescription>{mockUsers.filter(u => u.role === "student").length} registered students</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Active Today</h4>
                  <p className="text-2xl font-bold">245</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/users?role=student">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Instructors */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Instructors</CardTitle>
              <CardDescription>{mockUsers.filter(u => u.role === "instructor").length} registered instructors</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Pending Approval</h4>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/users?role=instructor">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Admins */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Administrators</CardTitle>
              <CardDescription>{mockUsers.filter(u => u.role === "admin").length} system administrators</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Active Now</h4>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/admin/users?role=admin">Manage</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pending Approvals and Reported Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {pendingApprovals.map((item) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        {item.type === "course" && <BookOpen className="h-4 w-4 text-amber-500" />}
                        {item.type === "instructor" && <User className="h-4 w-4 text-blue-500" />}
                        {item.type === "payout" && <DollarSign className="h-4 w-4 text-emerald-500" />}
                        <p className="font-medium">{item.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">By: {item.instructor}</p>
                      {item.amount && <p className="text-sm">Amount: {item.amount}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Submitted: {item.submittedDate}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8">
                        Reject
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link to="/admin/approvals">
                View All Pending Approvals <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Reported Content */}
        <Card>
          <CardHeader>
            <CardTitle>Reported Content</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {reportedContent.map((item) => (
                <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        {item.contentType === "course" && <BookOpen className="h-4 w-4 text-red-500" />}
                        {item.contentType === "review" && <Flag className="h-4 w-4 text-red-500" />}
                        <p className="font-medium">{item.title}</p>
                      </div>
                      <p className="text-sm">Reason: {item.reportReason}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>By: {item.reportedBy}</span>
                        <span className="mx-2">•</span>
                        <span>{item.reportCount} {item.reportCount === 1 ? 'report' : 'reports'}</span>
                        <span className="mx-2">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Review
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" className="mt-4 px-0" asChild>
              <Link to="/admin/reports">
                View All Reports <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
