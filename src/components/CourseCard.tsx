
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Clock, Bookmark, Play } from "lucide-react";
import { Course, CourseProgress } from "@/types";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  isEnrolled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress, isEnrolled }) => {
  return (
    <Card className="course-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={course.thumbnail_url}
          alt={course.title}
          className="w-full aspect-video object-cover"
        />
        
        {isEnrolled && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              Enrolled
            </Badge>
          </div>
        )}
        
        {course.level && (
          <div className="absolute bottom-2 left-2">
            <Badge className="capitalize bg-background/80 backdrop-blur-sm text-foreground">
              {course.level}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <span>By {course.instructor_name}</span>
          </div>
          
          {course.rating !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <div className="flex text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-foreground">{course.rating.toFixed(1)}</span>
              </div>
              {course.total_reviews !== undefined && (
                <span className="text-muted-foreground">
                  ({course.total_reviews > 1000 
                    ? `${(course.total_reviews / 1000).toFixed(1)}k` 
                    : course.total_reviews} {course.total_reviews === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
            {course.total_lectures !== undefined && (
              <>
                <span className="mx-1">•</span>
                <span>{course.total_lectures} lectures</span>
              </>
            )}
          </div>
          
          {progress && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{progress.progress_percentage}%</span>
              </div>
              <Progress value={progress.progress_percentage} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full flex gap-2">
          {isEnrolled ? (
            <Button asChild className="w-full">
              <Link to={`/course/${course.id}`}>
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild className="w-full">
                <Link to={`/course/${course.id}`}>View Course</Link>
              </Button>
              <Button variant="outline" size="icon" title="Add to wishlist">
                <Bookmark className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
