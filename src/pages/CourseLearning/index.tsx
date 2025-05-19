
import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useCourses } from "@/context/CourseContext";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import VideoPlayer from "@/components/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, Download, FileText, Play } from "lucide-react";
import { toast } from "sonner";
import LectureContent from "./LectureContent";
import QuizComponent from "./QuizComponent";
import DiscussionSection from "./DiscussionSection";
import { Course } from "@/types";

const CourseLearning = () => {
  const { courseId, lectureId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { 
    getCourse, 
    getCourseSections, 
    getCourseLectures, 
    updateCourseProgress, 
    loading: courseLoading 
  } = useCourses();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [activeLecture, setActiveLecture] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await getCourse(courseId);
        if (courseData) {
          setCourse(courseData);
          
          // Fetch sections
          const sectionsData = await getCourseSections(courseId);
          setSections(sectionsData);
          
          // If sections exist and no active section is set yet
          if (sectionsData.length > 0 && !activeSection) {
            setActiveSection(sectionsData[0].id);
            
            // Fetch lectures for the first section
            const lecturesData = await getCourseLectures(sectionsData[0].id);
            
            // If lectures exist and no active lecture is set yet
            if (lecturesData.length > 0 && !activeLecture) {
              setActiveLecture(lecturesData[0]);
            }
          }
          
          // If lectureId is provided, find and set the active lecture
          if (lectureId) {
            for (const section of sectionsData) {
              const sectionLectures = await getCourseLectures(section.id);
              const lecture = sectionLectures.find(l => l.id === lectureId);
              
              if (lecture) {
                setActiveSection(section.id);
                setActiveLecture(lecture);
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, lectureId]);

  const handleLectureSelect = async (sectionId: string, lecture: any) => {
    setActiveSection(sectionId);
    setActiveLecture(lecture);
    
    try {
      // Calculate course progress
      const totalLectures = sections.reduce((count, section) => {
        return count + section.lectures?.length || 0;
      }, 0);
      
      // Mark lecture as completed
      if (user && courseId) {
        const updatedCompletedLectures = [...completedLectures];
        if (!updatedCompletedLectures.includes(lecture.id)) {
          updatedCompletedLectures.push(lecture.id);
          setCompletedLectures(updatedCompletedLectures);
        }
        
        const newProgress = totalLectures > 0 
          ? Math.round((updatedCompletedLectures.length / totalLectures) * 100) 
          : 0;
        
        setProgress(newProgress);
        
        // Update progress in database
        await updateCourseProgress(courseId, lecture.id, newProgress);
      }
    } catch (error) {
      console.error("Error updating lecture progress:", error);
    }
  };

  const handleVideoComplete = async () => {
    if (!user || !courseId || !activeLecture) return;
    
    try {
      // Mark lecture as completed automatically
      const updatedCompletedLectures = [...completedLectures];
      if (!updatedCompletedLectures.includes(activeLecture.id)) {
        updatedCompletedLectures.push(activeLecture.id);
        setCompletedLectures(updatedCompletedLectures);
        
        // Calculate course progress
        const totalLectures = sections.reduce((count, section) => {
          return count + section.lectures?.length || 0;
        }, 0);
        
        const newProgress = totalLectures > 0 
          ? Math.round((updatedCompletedLectures.length / totalLectures) * 100) 
          : 0;
        
        setProgress(newProgress);
        
        // Update progress in database
        await updateCourseProgress(courseId, activeLecture.id, newProgress);
        
        toast.success("Lecture completed!");
      }
    } catch (error) {
      console.error("Error updating lecture completion:", error);
    }
  };

  const loadSectionLectures = async (sectionId: string) => {
    try {
      const lectures = await getCourseLectures(sectionId);
      const updatedSections = sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            lectures
          };
        }
        return section;
      });
      
      setSections(updatedSections);
    } catch (error) {
      console.error("Error loading section lectures:", error);
    }
  };

  if (authLoading || courseLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading course content...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="bg-primary text-primary-foreground py-4 px-6">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">{course.title}</h1>
          <div className="flex items-center text-sm mt-1">
            <p className="opacity-80">Instructor: {course.instructor_name}</p>
            <div className="mx-2 h-4 w-px bg-primary-foreground/30" />
            <p className="opacity-80">Progress: {progress}%</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course Content Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Course Content</h2>
                  <Progress value={progress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {completedLectures.length} lectures completed
                  </p>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto">
                  <Accordion 
                    type="multiple" 
                    defaultValue={activeSection ? [activeSection] : []}
                  >
                    {sections.map((section) => (
                      <AccordionItem 
                        value={section.id} 
                        key={section.id}
                        onFocus={() => !section.lectures && loadSectionLectures(section.id)}
                      >
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                          <div className="flex flex-col items-start text-left">
                            <span>{section.title}</span>
                            {section.lectures && (
                              <span className="text-xs text-muted-foreground">
                                {section.lectures.length} lectures
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 py-0">
                          <ul className="divide-y">
                            {section.lectures?.map((lecture: any) => (
                              <li 
                                key={lecture.id}
                                onClick={() => handleLectureSelect(section.id, lecture)}
                                className={`flex items-center gap-2 p-3 hover:bg-muted cursor-pointer text-sm ${
                                  activeLecture?.id === lecture.id ? 'bg-muted' : ''
                                }`}
                              >
                                {completedLectures.includes(lecture.id) ? (
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                ) : lecture.video_url ? (
                                  <Play className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 flex-shrink-0" />
                                )}
                                <span className="flex-grow">{lecture.title}</span>
                                {lecture.duration && (
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lecture.duration}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {activeLecture ? (
              <>
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  {activeLecture.video_url ? (
                    <VideoPlayer 
                      videoUrl={activeLecture.video_url}
                      title={activeLecture.title}
                      onComplete={handleVideoComplete}
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-white bg-zinc-800">
                      <div className="text-center">
                        <FileText size={48} className="mx-auto mb-2" />
                        <p>This lecture doesn't contain a video</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{activeLecture.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {activeLecture.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {activeLecture.duration}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {!completedLectures.includes(activeLecture.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleLectureSelect(activeSection!, activeLecture)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as completed
                      </Button>
                    )}
                    
                    {activeLecture.materials && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <a href={activeLecture.materials} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          Materials
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <LectureContent lectureId={activeLecture.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="quiz" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <QuizComponent lectureId={activeLecture.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="discussion" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <DiscussionSection lectureId={activeLecture.id} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="bg-muted/20 rounded-lg p-8 text-center h-96 flex items-center justify-center">
                <div>
                  <Play size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-2xl font-bold mb-2">Select a lesson to start learning</h2>
                  <p className="text-muted-foreground">
                    Choose a lecture from the sidebar to begin your learning journey
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
