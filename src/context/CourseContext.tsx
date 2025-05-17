
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { mockCourses, mockCourseProgress } from "../data/mockData";
import { Course, CourseProgress } from "../types";
import { useAuth } from "./AuthContext";

interface CourseContextType {
  courses: Course[];
  enrolledCourses: Course[];
  courseProgress: CourseProgress[];
  loading: boolean;
  getCourse: (courseId: string) => Course | undefined;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateCourseProgress: (courseId: string, lectureId: string, progressPercentage: number) => Promise<void>;
  searchCourses: (query: string) => Course[];
  filterCoursesByCategory: (category: string) => Course[];
  addCourse: (course: Omit<Course, "id" | "created_at" | "updated_at">) => Promise<void>;
  updateCourse: (courseId: string, courseData: Partial<Course>) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
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

  // Initialize courses from mock data
  useEffect(() => {
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  // Update enrolled courses when user changes
  useEffect(() => {
    if (user) {
      // In a real app, we'd fetch enrolled courses from the API
      const userProgress = mockCourseProgress.filter(progress => progress.user_id === user.id);
      setCourseProgress(userProgress);
      
      // Get enrolled courses based on progress
      const userEnrolledCourses = courses.filter(course => 
        userProgress.some(progress => progress.course_id === course.id)
      );
      setEnrolledCourses(userEnrolledCourses);
    } else {
      setCourseProgress([]);
      setEnrolledCourses([]);
    }
  }, [user, courses]);

  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  const getCourseProgress = (courseId: string) => {
    if (!user) return undefined;
    return courseProgress.find(progress => progress.course_id === courseId && progress.user_id === user.id);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error("Please sign in to enroll in courses");
      throw new Error("No user is signed in");
    }

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      
      // Check if already enrolled
      if (enrolledCourses.some(c => c.id === courseId)) {
        throw new Error("You are already enrolled in this course");
      }
      
      // Create new progress record
      const newProgress: CourseProgress = {
        course_id: courseId,
        user_id: user.id,
        completed_lectures: [],
        progress_percentage: 0,
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCourseProgress([...courseProgress, newProgress]);
      setEnrolledCourses([...enrolledCourses, course]);
      toast.success(`Successfully enrolled in "${course.title}"`);
    } catch (error) {
      toast.error((error as Error).message);
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
      // Find existing progress
      const existingProgressIndex = courseProgress.findIndex(
        p => p.course_id === courseId && p.user_id === user.id
      );
      
      // If no progress record exists, create one
      if (existingProgressIndex === -1) {
        const newProgress: CourseProgress = {
          course_id: courseId,
          user_id: user.id,
          completed_lectures: [lectureId],
          progress_percentage: progressPercentage,
          last_watched_lecture: lectureId,
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setCourseProgress([...courseProgress, newProgress]);
      } else {
        // Update existing progress
        const updatedProgress = [...courseProgress];
        const currentProgress = updatedProgress[existingProgressIndex];
        
        // Add lecture to completed if not already there
        if (!currentProgress.completed_lectures.includes(lectureId)) {
          currentProgress.completed_lectures.push(lectureId);
        }
        
        currentProgress.progress_percentage = progressPercentage;
        currentProgress.last_watched_lecture = lectureId;
        currentProgress.updated_at = new Date().toISOString();
        
        setCourseProgress(updatedProgress);
      }
    } catch (error) {
      toast.error("Failed to update progress");
      throw error;
    }
  };

  const searchCourses = (query: string) => {
    if (!query) return courses;
    
    const searchTerm = query.toLowerCase().trim();
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.instructor_name.toLowerCase().includes(searchTerm) ||
      course.categories?.some(cat => cat.toLowerCase().includes(searchTerm)) ||
      course.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };

  const filterCoursesByCategory = (category: string) => {
    if (!category || category === "All Categories") return courses;
    
    return courses.filter(course => 
      course.categories?.includes(category)
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCourse: Course = {
        ...courseData,
        id: `course_${Date.now().toString()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCourses([...courses, newCourse]);
      toast.success("Course created successfully!");
    } catch (error) {
      toast.error("Failed to create course");
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) {
        throw new Error("Course not found");
      }

      // Only instructors who own the course or admins can update
      const course = courses[courseIndex];
      if (user.role === "instructor" && course.instructor_id !== user.id) {
        throw new Error("You don't have permission to update this course");
      }
      
      const updatedCourses = [...courses];
      updatedCourses[courseIndex] = {
        ...course,
        ...courseData,
        updated_at: new Date().toISOString(),
      };
      
      setCourses(updatedCourses);
      toast.success("Course updated successfully!");
    } catch (error) {
      toast.error((error as Error).message);
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) {
        throw new Error("Course not found");
      }

      // Only instructors who own the course or admins can delete
      const course = courses[courseIndex];
      if (user.role === "instructor" && course.instructor_id !== user.id) {
        throw new Error("You don't have permission to delete this course");
      }
      
      const updatedCourses = courses.filter(c => c.id !== courseId);
      setCourses(updatedCourses);
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
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
        deleteCourse
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
