
import React from "react";
import { Course, CourseProgress } from "@/types";
import CourseCard from "./CourseCard";

interface CourseGridProps {
  courses: Course[];
  progress?: CourseProgress[];
  enrolledCourseIds?: string[];
  loading?: boolean;
  emptyMessage?: string;
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  progress = [],
  enrolledCourseIds = [],
  loading = false,
  emptyMessage = "No courses found",
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="course-card">
            <div className="w-full aspect-video bg-muted animate-pulse" />
            <div className="p-4">
              <div className="h-6 w-3/4 bg-muted animate-pulse mb-2 rounded" />
              <div className="h-4 w-1/2 bg-muted animate-pulse mb-3 rounded" />
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course) => {
        const isEnrolled = enrolledCourseIds.includes(course.id);
        const courseProgress = progress.find((p) => p.course_id === course.id);
        
        return (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={isEnrolled}
            progress={courseProgress}
          />
        );
      })}
    </div>
  );
};

export default CourseGrid;
