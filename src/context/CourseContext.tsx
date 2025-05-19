import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Course, CourseProgress } from "../types";
import { useAuth } from "./AuthContext";
import { dummyCourses, dummySections, dummyLectures, dummyProgress } from "@/utils/dummyData";

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  courseProgress: CourseProgress[];
  loading: boolean;
  getCourse: (courseId: string) => Promise<Course | null>;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateCourseProgress: (courseId: string, lectureId: string, progressPercentage: number) => Promise<void>;
  searchCourses: (query: string) => Course[];
  filterCoursesByCategory: (categoryId: string) => Course[];
  addCourse: (course: Omit<Course, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  fetchCourseCategories: () => Promise<{ id: string; name: string }[]>;
  getCourseSections: (courseId: string) => Promise<any[]>;
  getCourseLectures: (sectionId: string) => Promise<any[]>;
  getFeaturedCourses: () => Promise<Course[]>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
};

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);

  // Fetch all courses on initial load
  useEffect(() => {
    // Only fetch courses if not in initializing state
    if (dbInitialized) {
      fetchCourses().catch(error => {
        // Handle error but don't show toast for known DB issues
        if (!error.message.includes("relationship between 'courses' and 'instructor_id'")) {
          toast.error(`Error fetching courses: ${error.message}`);
        }
      });
    }
  }, [dbInitialized]);

  // Check DB initialization status
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Try to read users table to check if db is initialized
        const { data, error } = await supabase
          .from('users')
          .select('count');
        
        if (!error) {
          setDbInitialized(true);
        }
      } catch (error) {
        // DB not initialized yet, will retry after admin logs in
        console.log("Database not fully initialized yet");
      } finally {
        setLoading(false);
      }
    };
    
    checkDatabase();
  }, [user]);

  // Fetch enrolled courses when user changes
  useEffect(() => {
    if (user && dbInitialized) {
      fetchEnrolledCourses().catch(error => {
        // Silently handle known errors during initialization
        console.log("Error fetching enrolled courses:", error);
      });
    } else {
      setEnrolledCourses([]);
      setCourseProgress([]);
    }
  }, [user, dbInitialized]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Modified query to handle potential schema issues
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) throw error;
      
      if (data) {
        // Process courses without relying on join relationship
        const userPromises = data.map(course => 
          supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', course.instructor_id)
            .single()
        );
        
        const userResults = await Promise.all(userPromises);
        
        const formattedCourses: Course[] = data.map((course, index) => {
          const instructor = userResults[index].data || { first_name: "Unknown", last_name: "Instructor" };
          
          return {
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            instructor_id: course.instructor_id,
            instructor_name: `${instructor.first_name} ${instructor.last_name}`,
            price: course.price || undefined,
            rating: course.rating || undefined,
            total_students: course.total_students || undefined,
            total_reviews: course.total_reviews || undefined,
            total_lectures: course.total_lectures || undefined,
            duration: course.duration || undefined,
            level: course.level,
            created_at: course.created_at,
            updated_at: course.updated_at,
            categories: [course.category_id], // Will be expanded in the future
          };
        });
        
        setCourses(formattedCourses);
      }
    } catch (error: any) {
      // Only show toast for real errors, not initialization issues
      if (!error.message.includes("relation") && !error.message.includes("does not exist")) {
        toast.error(`Failed to fetch courses: ${error.message}`);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get enrolled course IDs
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('id, course_id')  // Make sure to select the id field
        .eq('user_id', user.id);
      
      if (enrollmentError) throw enrollmentError;
      
      if (enrollments && enrollments.length > 0) {
        const courseIds = enrollments.map(e => e.course_id);
        
        // Fetch course details
        const { data: enrolledCoursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .in('id', courseIds);
        
        if (coursesError) throw coursesError;
        
        if (enrolledCoursesData) {
          const formattedCourses: Course[] = enrolledCoursesData.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            thumbnail_url: course.thumbnail_url,
            instructor_id: course.instructor_id,
            instructor_name: `${course.users.first_name} ${course.users.last_name}`,
            price: course.price || undefined,
            rating: course.rating || undefined,
            total_students: course.total_students || undefined,
            total_reviews: course.total_reviews || undefined,
            total_lectures: course.total_lectures || undefined,
            duration: course.duration || undefined,
            level: course.level,
            created_at: course.created_at,
            updated_at: course.updated_at,
            categories: [course.category_id], // Will be expanded in the future
          }));
          
          setEnrolledCourses(formattedCourses);
          
          // Fetch course progress
          const { data: progressData, error: progressError } = await supabase
            .from('course_progress')
            .select('*')
            .in('enrollment_id', enrollments.map(e => e.id));
          
          if (progressError) throw progressError;
          
          if (progressData) {
            setCourseProgress(progressData as CourseProgress[]);
          }
        }
      }
    } catch (error: any) {
      toast.error(`Failed to fetch enrolled courses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCourse = async (courseId: string): Promise<Course | null> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          users:instructor_id (first_name, last_name)
        `)
        .eq('id', courseId)
        .single();
      
      if (error) {
        console.error("Error fetching course:", error);
        
        // Use dummy data as fallback
        const dummyCourse = dummyCourses.find(c => c.id === courseId);
        if (dummyCourse) {
          console.log("Using dummy course data as fallback");
          return dummyCourse;
        }
        
        throw error;
      }
      
      if (data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          thumbnail_url: data.thumbnail_url,
          instructor_id: data.instructor_id,
          instructor_name: `${data.users.first_name} ${data.users.last_name}`,
          price: data.price || undefined,
          rating: data.rating || undefined,
          total_students: data.total_students || undefined,
          total_reviews: data.total_reviews || undefined,
          total_lectures: data.total_lectures || undefined,
          duration: data.duration || undefined,
          level: data.level,
          created_at: data.created_at,
          updated_at: data.updated_at,
          categories: [data.category_id], // Will be expanded in the future
        };
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching course:", error);
      
      // Use dummy data as fallback
      const dummyCourse = dummyCourses.find(c => c.id === courseId);
      if (dummyCourse) {
        console.log("Using dummy course data as fallback");
        return dummyCourse;
      }
      
      return null;
    }
  };

  const getCourseProgress = (courseId: string) => {
    if (!user) return undefined;
    
    // Try to find real progress data
    const progress = courseProgress.find(progress => progress.course_id === courseId);
    if (progress) return progress;
    
    // Use dummy progress as fallback
    return dummyProgress.find(p => p.course_id === courseId);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error("Please sign in to enroll in courses");
      throw new Error("No user is signed in");
    }

    setLoading(true);
    try {
      // Create enrollment record
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          enrolled_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (enrollmentError) throw enrollmentError;
      
      // Create progress record
      if (enrollment) {
        const { error: progressError } = await supabase
          .from('course_progress')
          .insert({
            enrollment_id: enrollment.id,
            completed_lectures: [],
            progress_percentage: 0,
            updated_at: new Date().toISOString()
          });
        
        if (progressError) throw progressError;
      }
      
      // Update course enrollment count
      const { error: updateError } = await supabase.rpc('increment_course_students', {
        course_id: courseId,
        increment_by: 1
      });
      
      if (updateError) console.error("Failed to update student count:", updateError);
      
      // Refresh enrolled courses
      await fetchEnrolledCourses();
      
      toast.success("Successfully enrolled in the course!");
    } catch (error: any) {
      toast.error(`Failed to enroll: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCourseProgress = async (courseId: string, lectureId: string, progressPercentage: number) => {
    if (!user) {
      toast.error("Please sign in to track progress");
      throw new Error("No user is signed in");
    }

    try {
      // Get enrollment ID
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .single();
      
      if (enrollmentError) throw enrollmentError;
      
      if (!enrollment) throw new Error("Not enrolled in this course");
      
      // Get current progress
      const { data: progress, error: progressError } = await supabase
        .from('course_progress')
        .select('*')
        .eq('enrollment_id', enrollment.id)
        .single();
      
      if (progressError && progressError.code !== 'PGRST116') throw progressError;
      
      if (progress) {
        // Update existing progress
        const updatedLectures = progress.completed_lectures.includes(lectureId)
          ? progress.completed_lectures
          : [...progress.completed_lectures, lectureId];
        
        const { error: updateError } = await supabase
          .from('course_progress')
          .update({
            completed_lectures: updatedLectures,
            progress_percentage: progressPercentage,
            last_watched_lecture: lectureId,
            updated_at: new Date().toISOString()
          })
          .eq('id', progress.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new progress record
        const { error: createError } = await supabase
          .from('course_progress')
          .insert({
            enrollment_id: enrollment.id,
            completed_lectures: [lectureId],
            progress_percentage: progressPercentage,
            last_watched_lecture: lectureId,
            updated_at: new Date().toISOString()
          });
        
        if (createError) throw createError;
      }
      
      // Refresh progress data
      await fetchEnrolledCourses();
    } catch (error: any) {
      toast.error(`Failed to update progress: ${error.message}`);
      throw error;
    }
  };

  const searchCourses = (query: string) => {
    if (!query) return courses;
    
    const searchTerm = query.toLowerCase().trim();
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor_name.toLowerCase().includes(searchTerm)
    );
  };

  const filterCoursesByCategory = (categoryId: string) => {
    if (!categoryId || categoryId === "all") return courses;
    
    return courses.filter(course => 
      course.categories?.includes(categoryId)
    );
  };

  const addCourse = async (courseData: Omit<Course, "id" | "created_at" | "updated_at">) => {
    if (!user) {
      toast.error("Please sign in to create a course");
      throw new Error("No user is signed in");
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      toast.error("Only instructors can create courses");
      throw new Error("Insufficient permissions");
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          thumbnail_url: courseData.thumbnail_url,
          instructor_id: user.id,
          price: courseData.price || null,
          level: courseData.level || 'all-levels',
          created_at: now,
          updated_at: now,
          published: false,
          featured: false,
          total_lectures: courseData.total_lectures || 0,
          duration: courseData.duration || null,
          category_id: courseData.categories?.[0] || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        await fetchCourses();
      }
      
      toast.success("Course created successfully!");
    } catch (error: any) {
      toast.error(`Failed to create course: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    if (!user) {
      toast.error("Please sign in to update a course");
      throw new Error("No user is signed in");
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      toast.error("Only instructors can update courses");
      throw new Error("Insufficient permissions");
    }

    setLoading(true);
    try {
      // Check course ownership
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('instructor_id, category_id')  // Make sure to include category_id
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      if (course && user.role === "instructor" && course.instructor_id !== user.id) {
        throw new Error("You don't have permission to update this course");
      }
      
      // Update course
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          ...courseData,
          updated_at: new Date().toISOString(),
          category_id: courseData.categories?.[0] || course?.category_id
        })
        .eq('id', courseId);
      
      if (updateError) throw updateError;
      
      await fetchCourses();
      
      toast.success("Course updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update course: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!user) {
      toast.error("Please sign in to delete a course");
      throw new Error("No user is signed in");
    }

    if (user.role !== "instructor" && user.role !== "admin") {
      toast.error("Only instructors can delete courses");
      throw new Error("Insufficient permissions");
    }

    setLoading(true);
    try {
      // Check course ownership
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();
      
      if (courseError) throw courseError;
      
      if (course && user.role === "instructor" && course.instructor_id !== user.id) {
        throw new Error("You don't have permission to delete this course");
      }
      
      // Delete course
      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (deleteError) throw deleteError;
      
      await fetchCourses();
      
      toast.success("Course deleted successfully!");
    } catch (error: any) {
      toast.error(`Failed to delete course: ${error.message}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  const getCourseSections = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_sections')
        .select('*')
        .eq('course_id', courseId)
        .order('order');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data;
      } else {
        // Use dummy sections as fallback
        console.log("Using dummy sections data as fallback");
        return dummySections[courseId] || [];
      }
    } catch (error) {
      console.error("Error fetching course sections:", error);
      // Use dummy sections as fallback
      return dummySections[courseId] || [];
    }
  };

  const getCourseLectures = async (sectionId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_lectures')
        .select('*')
        .eq('section_id', sectionId)
        .order('order');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data;
      } else {
        // Use dummy lectures as fallback
        console.log("Using dummy lectures data as fallback");
        return dummyLectures[sectionId] || [];
      }
    } catch (error) {
      console.error("Error fetching course lectures:", error);
      // Use dummy lectures as fallback
      return dummyLectures[sectionId] || [];
    }
  };

  const getFeaturedCourses = async (): Promise<Course[]> => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          users:instructor_id (first_name, last_name)
        `)
        .eq('featured', true)
        .eq('published', true)
        .limit(5);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnail_url: course.thumbnail_url,
          instructor_id: course.instructor_id,
          instructor_name: `${course.users.first_name} ${course.users.last_name}`,
          price: course.price || undefined,
          rating: course.rating || undefined,
          total_students: course.total_students || undefined,
          total_reviews: course.total_reviews || undefined,
          total_lectures: course.total_lectures || undefined,
          duration: course.duration || undefined,
          level: course.level,
          created_at: course.created_at,
          updated_at: course.updated_at,
          categories: [course.category_id], // Will be expanded in the future
        }));
      }
      
      // Use dummy courses as fallback
      console.log("Using dummy courses data as fallback");
      return dummyCourses;
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      // Use dummy courses as fallback
      return dummyCourses;
    }
  };

  return (
    <CourseContext.Provider 
      value={{
        courses,
        enrolledCourses,
        courseProgress,
        loading,
        getCourse,
        getCourseProgress,
        enrollInCourse,
        updateCourseProgress,
        searchCourses,
        filterCoursesByCategory,
        addCourse,
        updateCourse,
        deleteCourse,
        fetchCourseCategories,
        getCourseSections,
        getCourseLectures,
        getFeaturedCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
