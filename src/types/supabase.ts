
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url: string | null;
          role: 'student' | 'instructor' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string | null;
          role?: 'student' | 'instructor' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string | null;
          role?: 'student' | 'instructor' | 'admin';
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail_url: string;
          instructor_id: string;
          price: number | null;
          level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
          created_at: string;
          updated_at: string;
          published: boolean;
          featured: boolean;
          total_lectures: number;
          duration: string | null;
          category_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          thumbnail_url: string;
          instructor_id: string;
          price?: number | null;
          level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          featured?: boolean;
          total_lectures?: number;
          duration?: string | null;
          category_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          thumbnail_url?: string;
          instructor_id?: string;
          price?: number | null;
          level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
          created_at?: string;
          updated_at?: string;
          published?: boolean;
          featured?: boolean;
          total_lectures?: number;
          duration?: string | null;
          category_id?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      course_sections: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          order?: number;
          created_at?: string;
        };
      };
      course_lectures: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          video_url: string | null;
          duration: string | null;
          order: number;
          is_free: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          video_url?: string | null;
          duration?: string | null;
          order: number;
          is_free?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          video_url?: string | null;
          duration?: string | null;
          order?: number;
          is_free?: boolean;
          created_at?: string;
        };
      };
      course_enrollments: {
        Row: {
          id: string;
          course_id: string;
          user_id: string;
          enrolled_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          course_id: string;
          user_id: string;
          enrolled_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          course_id?: string;
          user_id?: string;
          enrolled_at?: string;
          completed_at?: string | null;
        };
      };
      course_progress: {
        Row: {
          id: string;
          enrollment_id: string;
          completed_lectures: string[];
          progress_percentage: number;
          last_watched_lecture: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enrollment_id: string;
          completed_lectures?: string[];
          progress_percentage?: number;
          last_watched_lecture?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          enrollment_id?: string;
          completed_lectures?: string[];
          progress_percentage?: number;
          last_watched_lecture?: string | null;
          updated_at?: string;
        };
      };
      course_materials: {
        Row: {
          id: string;
          lecture_id: string | null;
          section_id: string | null;
          title: string;
          file_url: string;
          file_type: string;
          file_size: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lecture_id?: string | null;
          section_id?: string | null;
          title: string;
          file_url: string;
          file_type: string;
          file_size?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lecture_id?: string | null;
          section_id?: string | null;
          title?: string;
          file_url?: string;
          file_type?: string;
          file_size?: string | null;
          created_at?: string;
        };
      };
      quizzes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          section_id: string | null;
          lecture_id: string | null;
          time_limit: number | null;
          pass_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          section_id?: string | null;
          lecture_id?: string | null;
          time_limit?: number | null;
          pass_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          section_id?: string | null;
          lecture_id?: string | null;
          time_limit?: number | null;
          pass_score?: number;
          created_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question: string;
          question_type: 'multiple_choice' | 'true_false' | 'short_answer';
          options: Json | null;
          correct_answer: Json;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question: string;
          question_type: 'multiple_choice' | 'true_false' | 'short_answer';
          options?: Json | null;
          correct_answer: Json;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question?: string;
          question_type?: 'multiple_choice' | 'true_false' | 'short_answer';
          options?: Json | null;
          correct_answer?: Json;
          explanation?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
