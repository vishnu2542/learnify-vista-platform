
export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instructor_id: string;
  instructor_name: string;
  price?: number;
  rating?: number;
  total_students?: number;
  total_reviews?: number;
  total_lectures?: number;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced" | "all-levels";
  created_at: string;
  updated_at: string;
  categories?: string[];
  tags?: string[];
}

export interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  order: number;
}

export interface CourseLecture {
  id: string;
  section_id: string;
  title: string;
  video_url?: string;
  duration?: string;
  order: number;
  is_free?: boolean;
}

export interface CourseProgress {
  course_id: string;
  user_id: string;
  completed_lectures: string[];
  progress_percentage: number;
  last_watched_lecture?: string;
  started_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  user_id: string;
  enrolled_at: string;
  completed_at?: string;
}

export interface CourseReview {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  lecture_id?: string;
  section_id?: string;
  title: string;
  description?: string;
  time_limit?: number;
  pass_score?: number;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  question_type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
}

export interface CourseMaterial {
  id: string;
  lecture_id?: string;
  section_id?: string;
  title: string;
  file_url: string;
  file_type: string;
  file_size?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  course_id: string;
  course: Course;
  added_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  payment_method?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  course_id: string;
  course?: Course;
  price: number;
  created_at: string;
}

export interface AdminStats {
  userCount: number;
  courseCount: number;
  enrollmentCount: number;
  revenueTotal?: number;
  userTrend?: number;
  courseTrend?: number;
  enrollmentTrend?: number;
  revenueTrend?: number;
}
