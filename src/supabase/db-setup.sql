
-- This file contains SQL for setting up the database schema in Supabase
-- It's not used directly in the application but serves as a reference

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

-- Users table policy
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
  ON public.users 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" 
  ON public.courses 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Instructors can view their own courses" 
  ON public.courses 
  FOR SELECT 
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can update their own courses" 
  ON public.courses 
  FOR UPDATE 
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can delete their own courses" 
  ON public.courses 
  FOR DELETE 
  USING (instructor_id = auth.uid());

CREATE POLICY "Instructors can insert courses" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (instructor_id = auth.uid());

CREATE POLICY "Admins can manage all courses" 
  ON public.courses 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Course sections policies
CREATE POLICY "Anyone can view sections of published courses" 
  ON public.course_sections 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses WHERE id = course_id AND published = true
  ));

CREATE POLICY "Instructors can manage sections of their courses" 
  ON public.course_sections 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all sections" 
  ON public.course_sections 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Course lectures policies
CREATE POLICY "Anyone can view lectures of published courses" 
  ON public.course_lectures 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_sections s
    JOIN courses c ON s.course_id = c.id
    WHERE s.id = section_id AND c.published = true
  ));

CREATE POLICY "Instructors can manage lectures of their courses" 
  ON public.course_lectures 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM course_sections s
    JOIN courses c ON s.course_id = c.id
    WHERE s.id = section_id AND c.instructor_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all lectures" 
  ON public.course_lectures 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Course enrollments policies
CREATE POLICY "Students can view their own enrollments" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Instructors can view enrollments for their courses" 
  ON public.course_enrollments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM courses WHERE id = course_id AND instructor_id = auth.uid()
  ));

CREATE POLICY "Students can enroll themselves" 
  ON public.course_enrollments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all enrollments" 
  ON public.course_enrollments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Course progress policies
CREATE POLICY "Students can view their own progress" 
  ON public.course_progress 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_enrollments WHERE id = enrollment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Students can update their own progress" 
  ON public.course_progress 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM course_enrollments WHERE id = enrollment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Students can insert their own progress" 
  ON public.course_progress 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM course_enrollments WHERE id = enrollment_id AND user_id = auth.uid()
  ));

CREATE POLICY "Instructors can view progress for their courses" 
  ON public.course_progress 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = enrollment_id AND c.instructor_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all progress" 
  ON public.course_progress 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Course materials policies
CREATE POLICY "Anyone can view materials of published courses" 
  ON public.course_materials 
  FOR SELECT 
  USING (
    (lecture_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_lectures l
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE l.id = lecture_id AND c.published = true
    )) OR
    (section_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = section_id AND c.published = true
    ))
  );

CREATE POLICY "Instructors can manage materials for their courses" 
  ON public.course_materials 
  FOR ALL 
  USING (
    (lecture_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_lectures l
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE l.id = lecture_id AND c.instructor_id = auth.uid()
    )) OR
    (section_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = section_id AND c.instructor_id = auth.uid()
    ))
  );

CREATE POLICY "Admins can manage all materials" 
  ON public.course_materials 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Categories policies
CREATE POLICY "Anyone can view categories" 
  ON public.categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage categories" 
  ON public.categories 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes of published courses" 
  ON public.quizzes 
  FOR SELECT 
  USING (
    (lecture_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_lectures l
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE l.id = lecture_id AND c.published = true
    )) OR
    (section_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = section_id AND c.published = true
    ))
  );

CREATE POLICY "Instructors can manage quizzes for their courses" 
  ON public.quizzes 
  FOR ALL 
  USING (
    (lecture_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_lectures l
      JOIN course_sections s ON l.section_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE l.id = lecture_id AND c.instructor_id = auth.uid()
    )) OR
    (section_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM course_sections s
      JOIN courses c ON s.course_id = c.id
      WHERE s.id = section_id AND c.instructor_id = auth.uid()
    ))
  );

-- Quiz questions policies
CREATE POLICY "Anyone can view questions of published courses' quizzes" 
  ON public.quiz_questions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM quizzes q
    LEFT JOIN course_lectures l ON q.lecture_id = l.id
    LEFT JOIN course_sections s ON COALESCE(q.section_id, l.section_id) = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE q.id = quiz_id AND c.published = true
  ));

CREATE POLICY "Instructors can manage questions for their courses' quizzes" 
  ON public.quiz_questions 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM quizzes q
    LEFT JOIN course_lectures l ON q.lecture_id = l.id
    LEFT JOIN course_sections s ON COALESCE(q.section_id, l.section_id) = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
  ));

-- Quiz attempts policies
CREATE POLICY "Students can view their own quiz attempts" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Students can insert their own quiz attempts" 
  ON public.quiz_attempts 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Instructors can view attempts for their courses' quizzes" 
  ON public.quiz_attempts 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM quizzes q
    LEFT JOIN course_lectures l ON q.lecture_id = l.id
    LEFT JOIN course_sections s ON COALESCE(q.section_id, l.section_id) = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE q.id = quiz_id AND c.instructor_id = auth.uid()
  ));

-- Lecture comments policies
CREATE POLICY "Anyone can view comments on published courses" 
  ON public.lecture_comments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_lectures l
    JOIN course_sections s ON l.section_id = s.id
    JOIN courses c ON s.course_id = c.id
    WHERE l.id = lecture_id AND c.published = true
  ));

CREATE POLICY "Authenticated users can add comments" 
  ON public.lecture_comments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.lecture_comments 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Comment likes policies
CREATE POLICY "Anyone can view comment likes" 
  ON public.comment_likes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can like comments" 
  ON public.comment_likes 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove their own likes" 
  ON public.comment_likes 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Comment reports policies
CREATE POLICY "Users can report comments" 
  ON public.comment_reports 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view reported comments" 
  ON public.comment_reports 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Helper functions
CREATE OR REPLACE FUNCTION increment_course_students(course_id UUID, increment_by INT)
RETURNS VOID AS $$
BEGIN
  UPDATE courses
  SET total_students = COALESCE(total_students, 0) + increment_by
  WHERE id = course_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_comment_like(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE lecture_comments
  SET likes = likes + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_comment_like(comment_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE lecture_comments
  SET likes = GREATEST(0, likes - 1)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql;
