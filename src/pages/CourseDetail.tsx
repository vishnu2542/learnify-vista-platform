
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VideoPlayer from "@/components/VideoPlayer";
import { Course } from "@/types";
import { mockCourses, mockUsers } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CourseContext";
import { 
  Clock, 
  Book, 
  Award, 
  BarChart3, 
  Users, 
  CheckSquare,
  Star,
  GraduationCap,
  FileText,
  Video,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { 
    enrollInCourse, 
    getCourse, 
    getCourseProgress, 
    enrolledCourses 
  } = useCourses();
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch the course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await getCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, getCourse]);
  
  // Check if user is enrolled
  const isEnrolled = enrolledCourses.some(c => c.id === courseId);
  
  // Get course progress if enrolled
  const progress = getCourseProgress(courseId as string);
  
  // Find instructor data
  const instructor = course?.instructor_id ? mockUsers.find(u => u.id === course.instructor_id) : undefined;
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <p className="text-muted-foreground">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Alert>
          <AlertDescription>
            Course not found. The course you're looking for might have been removed or doesn't exist.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild>
            <Link to="/explore">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleEnrollment = async () => {
    if (!user) {
      // If not logged in, redirect to sign in
      toast.warning("Please sign in to enroll in this course");
      return;
    }
    
    setEnrolling(true);
    
    try {
      await enrollInCourse(course.id);
      // Enrollment successful notification is handled in the context
    } catch (error) {
      // Error notification is handled in the context
      console.error("Enrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };
  
  const dummyLectures = [
    { id: "1", title: "Introduction to the Course", duration: "10:15", isFree: true },
    { id: "2", title: "Setting Up Your Environment", duration: "15:30", isFree: true },
    { id: "3", title: "Core Concepts", duration: "25:45", isFree: false },
    { id: "4", title: "Building Your First Project", duration: "32:20", isFree: false },
    { id: "5", title: "Advanced Techniques", duration: "28:55", isFree: false },
    { id: "6", title: "Best Practices", duration: "18:40", isFree: false },
  ];
  
  const dummyMaterials = [
    { id: "1", title: "Course Syllabus", type: "PDF" },
    { id: "2", title: "Code Examples", type: "ZIP" },
    { id: "3", title: "Cheat Sheet", type: "PDF" },
  ];
  
  return (
    <div className="pb-16">
      {/* Course header */}
      <div className="bg-primary/10 pt-10 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {course.categories && course.categories.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {course.categories.map((category) => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              
              <p className="text-muted-foreground">{course.description}</p>
              
              <div className="flex items-center gap-4 flex-wrap">
                {course.rating !== undefined && (
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-500">
                      <Star className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-medium">{course.rating.toFixed(1)}</span>
                    {course.total_reviews !== undefined && (
                      <span className="text-muted-foreground">
                        ({course.total_reviews} {course.total_reviews === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </div>
                )}
                
                {course.total_students !== undefined && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.total_students} students</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
                
                {course.level && (
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{course.level}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={instructor?.avatar_url} />
                  <AvatarFallback>{course.instructor_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Created by</p>
                  <p className="text-muted-foreground">{course.instructor_name}</p>
                </div>
              </div>
              
              <div className="pt-4">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <Button size="lg" asChild>
                      <Link to={`/course/${course.id}/learn`}>
                        Continue Learning
                      </Link>
                    </Button>
                    
                    {progress && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Your progress</span>
                          <span>{progress.progress_percentage}% complete</span>
                        </div>
                        <Progress value={progress.progress_percentage} className="h-2" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      {course.price !== undefined && (
                        <>
                          <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
                          <span className="text-muted-foreground line-through">${(course.price * 1.3).toFixed(2)}</span>
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm">30% off</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button size="lg" onClick={handleEnrollment} disabled={enrolling}>
                        {enrolling ? "Enrolling..." : "Enroll Now"}
                      </Button>
                      <Button size="lg" variant="outline">
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden shadow-xl">
              <VideoPlayer 
                videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                title={course.title}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Master the fundamentals of the subject</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Build real-world projects for your portfolio</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Understand advanced concepts and techniques</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Apply best practices in your work</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Troubleshoot common issues efficiently</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckSquare className="h-5 w-5 text-primary shrink-0" />
                      <span>Stay up-to-date with current trends</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                  <div className="space-y-4">
                    <p>
                      This comprehensive course is designed to take you from beginner to expert level. 
                      You'll learn not just the theory, but practical applications through hands-on projects 
                      and real-world examples.
                    </p>
                    <p>
                      Whether you're just starting out or looking to enhance your existing skills, this course 
                      provides a structured path to mastery. Each section builds on the previous one, ensuring a 
                      smooth learning experience.
                    </p>
                    <p>
                      By the end of this course, you'll have the confidence and knowledge to apply what you've 
                      learned in professional settings or personal projects.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>No prior knowledge required - we'll start from the basics</li>
                    <li>A computer with internet connection</li>
                    <li>Enthusiasm and willingness to learn</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">Who This Course Is For</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Beginners with no prior experience</li>
                    <li>Intermediate learners looking to fill knowledge gaps</li>
                    <li>Professionals wanting to update their skills</li>
                    <li>Anyone interested in mastering this subject</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-4">This Course Includes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      <span>{course.total_lectures} on-demand videos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>{course.duration} of content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span>3 downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span>Projects and assignments</span>
                    </li>
                  </ul>
                </div>
                
                {course.tags && course.tags.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-4">Share This Course</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                    </Button>
                    <Button variant="outline" size="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="curriculum" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground">
                  {dummyLectures.length} lectures • {course.duration} total length
                </p>
                <Button variant="link">Expand All Sections</Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted p-4">
                  <h3 className="font-medium">Section 1: Getting Started</h3>
                  <p className="text-sm text-muted-foreground">6 lectures • 1h 30m</p>
                </div>
                
                <ul className="divide-y">
                  {dummyLectures.map((lecture) => (
                    <li key={lecture.id} className="p-4 flex justify-between items-center hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{lecture.title}</span>
                        {lecture.isFree && (
                          <Badge variant="outline" className="ml-2">Preview</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{lecture.duration}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Materials list */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Course Materials</h2>
              <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y">
                  {dummyMaterials.map((material) => (
                    <li key={material.id} className="p-4 flex justify-between items-center hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{material.title}</span>
                        <Badge variant="outline">{material.type}</Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{course.rating?.toFixed(1)}</span>
                    <div className="text-lg">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(course.rating || 0) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">
                        Course Rating
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating bars */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <div className="flex items-center w-16">
                          <span>{star}</span>
                          <Star className={`h-4 w-4 ml-1 ${star <= Math.floor(course.rating || 0) ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`} />
                        </div>
                        <Progress 
                          value={star === 5 ? 75 : star === 4 ? 20 : 5} 
                          className="h-2 flex-grow" 
                        />
                        <span className="text-sm text-muted-foreground w-8">
                          {star === 5 ? "75%" : star === 4 ? "20%" : "5%"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-6">
                  {/* Sample reviews */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b pb-6 last:border-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">User Name {i}</p>
                              <p className="text-xs text-muted-foreground">2 weeks ago</p>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < (5 - i % 2) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2">
                          {i === 1
                            ? "This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand."
                            : i === 2
                            ? "Great content and practical examples. I learned a lot and was able to apply the knowledge immediately."
                            : "Well-structured course with comprehensive coverage of the topic. Highly recommended for beginners."}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Load More Reviews
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="instructor" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">About the Instructor</h2>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3 text-center">
                  <Avatar className="h-32 w-32 mx-auto">
                    <AvatarImage src={instructor?.avatar_url} />
                    <AvatarFallback className="text-4xl">{course.instructor_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-medium mt-4">{course.instructor_name}</h3>
                  <p className="text-muted-foreground">Professional Instructor</p>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="text-center">
                      <p className="font-bold">4.8</p>
                      <p className="text-sm text-muted-foreground">Instructor Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">1,234</p>
                      <p className="text-sm text-muted-foreground">Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">6</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">10,532</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <p>
                    I've been teaching online for over 5 years, helping thousands of students master 
                    new skills and advance their careers. My teaching approach focuses on practical, 
                    hands-on learning with real-world applications.
                  </p>
                  <p>
                    With over 10 years of industry experience, I bring real-world insights to my courses, 
                    ensuring that students not only learn the technical aspects but also understand how to 
                    apply their knowledge in professional settings.
                  </p>
                  <p>
                    My goal is to make complex subjects accessible to everyone, regardless of their background 
                    or prior experience. I believe in learning by doing, and my courses reflect this philosophy 
                    with numerous exercises, projects, and challenges.
                  </p>
                  
                  <h4 className="text-lg font-medium mt-6">Other Courses by {course.instructor_name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {mockCourses.slice(0, 2).map((otherCourse) => (
                      <Link 
                        key={otherCourse.id} 
                        to={`/course/${otherCourse.id}`} 
                        className="flex gap-4 border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <img 
                          src={otherCourse.thumbnail_url} 
                          alt={otherCourse.title} 
                          className="w-20 h-14 object-cover rounded"
                        />
                        <div>
                          <h5 className="font-medium line-clamp-2">{otherCourse.title}</h5>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
                            <span>{otherCourse.rating?.toFixed(1)} • {otherCourse.total_students} students</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
