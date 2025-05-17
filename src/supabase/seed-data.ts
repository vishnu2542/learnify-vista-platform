
import { supabase } from "../lib/supabase";

/**
 * Script to populate the database with sample data.
 * Run this after setting up the database tables and schema.
 */
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
    
    // Check if data already exists to prevent duplicate seeding
    const { data: existingUsers } = await supabase
      .from('users')
      .select('count');
    
    if (existingUsers && existingUsers[0]?.count > 0) {
      console.log("Database already contains data. Skipping seeding process.");
      return;
    }
    
    // Create admin user
    const adminEmail = 'admin@eduflow.com';
    
    const { data: admin, error: adminError } = await supabase.auth.signUp({
      email: adminEmail,
      password: 'Admin123!',
      options: {
        data: {
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin'
        }
      }
    });
    
    if (adminError) throw adminError;
    
    if (admin.user) {
      await supabase.from('users').insert({
        id: admin.user.id,
        email: adminEmail,
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        created_at: new Date().toISOString()
      });
    }
    
    // Create instructor users
    const instructors = [
      {
        email: 'john.smith@eduflow.com',
        password: 'Instructor123!',
        first_name: 'John',
        last_name: 'Smith'
      },
      {
        email: 'emma.wilson@eduflow.com',
        password: 'Instructor123!',
        first_name: 'Emma',
        last_name: 'Wilson'
      },
      {
        email: 'michael.johnson@eduflow.com',
        password: 'Instructor123!',
        first_name: 'Michael',
        last_name: 'Johnson'
      }
    ];
    
    const instructorIds: string[] = [];
    
    for (const instructor of instructors) {
      const { data: instructorData, error: instructorError } = await supabase.auth.signUp({
        email: instructor.email,
        password: instructor.password,
        options: {
          data: {
            first_name: instructor.first_name,
            last_name: instructor.last_name,
            role: 'instructor'
          }
        }
      });
      
      if (instructorError) throw instructorError;
      
      if (instructorData.user) {
        await supabase.from('users').insert({
          id: instructorData.user.id,
          email: instructor.email,
          first_name: instructor.first_name,
          last_name: instructor.last_name,
          role: 'instructor',
          created_at: new Date().toISOString()
        });
        
        instructorIds.push(instructorData.user.id);
      }
    }
    
    // Create student users
    const students = [
      {
        email: 'alex.brown@eduflow.com',
        password: 'Student123!',
        first_name: 'Alex',
        last_name: 'Brown'
      },
      {
        email: 'sophia.davis@eduflow.com',
        password: 'Student123!',
        first_name: 'Sophia',
        last_name: 'Davis'
      },
      {
        email: 'ethan.miller@eduflow.com',
        password: 'Student123!',
        first_name: 'Ethan',
        last_name: 'Miller'
      }
    ];
    
    const studentIds: string[] = [];
    
    for (const student of students) {
      const { data: studentData, error: studentError } = await supabase.auth.signUp({
        email: student.email,
        password: student.password,
        options: {
          data: {
            first_name: student.first_name,
            last_name: student.last_name,
            role: 'student'
          }
        }
      });
      
      if (studentError) throw studentError;
      
      if (studentData.user) {
        await supabase.from('users').insert({
          id: studentData.user.id,
          email: student.email,
          first_name: student.first_name,
          last_name: student.last_name,
          role: 'student',
          created_at: new Date().toISOString()
        });
        
        studentIds.push(studentData.user.id);
      }
    }
    
    // Create categories
    const categories = [
      { name: 'Web Development' },
      { name: 'Data Science' },
      { name: 'Mobile Development' },
      { name: 'UX/UI Design' },
      { name: 'Business' },
      { name: 'Marketing' }
    ];
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories.map(cat => ({
        name: cat.name,
        created_at: new Date().toISOString()
      })))
      .select();
    
    if (categoriesError) throw categoriesError;
    
    // Sample course data
    const courses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        thumbnail_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400',
        instructor_id: instructorIds[0],
        price: 49.99,
        level: 'beginner',
        published: true,
        featured: true,
        total_lectures: 12,
        duration: '10h 30m',
        category_id: categoriesData?.[0].id
      },
      {
        title: 'Python for Data Science',
        description: 'Master Python programming and learn how to analyze data using popular libraries.',
        thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400',
        instructor_id: instructorIds[1],
        price: 59.99,
        level: 'intermediate',
        published: true,
        featured: true,
        total_lectures: 15,
        duration: '12h 15m',
        category_id: categoriesData?.[1].id
      },
      {
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile apps using React Native and JavaScript.',
        thumbnail_url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&h=400',
        instructor_id: instructorIds[2],
        price: 69.99,
        level: 'intermediate',
        published: true,
        featured: false,
        total_lectures: 18,
        duration: '15h 20m',
        category_id: categoriesData?.[2].id
      },
      {
        title: 'UX/UI Design Fundamentals',
        description: 'Learn the principles of user experience and interface design.',
        thumbnail_url: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=600&h=400',
        instructor_id: instructorIds[0],
        price: 49.99,
        level: 'beginner',
        published: true,
        featured: true,
        total_lectures: 10,
        duration: '8h 45m',
        category_id: categoriesData?.[3].id
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Dive deep into advanced JavaScript concepts like closures, prototypes, and async programming.',
        thumbnail_url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&h=400',
        instructor_id: instructorIds[1],
        price: 79.99,
        level: 'advanced',
        published: true,
        featured: false,
        total_lectures: 20,
        duration: '16h 30m',
        category_id: categoriesData?.[0].id
      }
    ];
    
    // Insert courses
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .insert(courses.map(course => ({
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        instructor_id: course.instructor_id,
        price: course.price,
        level: course.level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: course.published,
        featured: course.featured,
        total_lectures: course.total_lectures,
        duration: course.duration,
        category_id: course.category_id
      })))
      .select();
    
    if (coursesError) throw coursesError;
    
    // Create course sections and lectures for the first course
    if (coursesData?.[0]) {
      const sections = [
        {
          course_id: coursesData[0].id,
          title: 'Introduction to HTML',
          order: 1,
        },
        {
          course_id: coursesData[0].id,
          title: 'CSS Fundamentals',
          order: 2,
        },
        {
          course_id: coursesData[0].id,
          title: 'JavaScript Basics',
          order: 3,
        }
      ];
      
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('course_sections')
        .insert(sections.map(section => ({
          ...section,
          created_at: new Date().toISOString()
        })))
        .select();
      
      if (sectionsError) throw sectionsError;
      
      // Create lectures for the first section
      if (sectionsData?.[0]) {
        const lectures = [
          {
            section_id: sectionsData[0].id,
            title: 'What is HTML?',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '10:30',
            order: 1,
            is_free: true,
            content: '<h2>Introduction to HTML</h2><p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</p><p>It defines the structure of web content using elements like paragraphs, headings, lists, links, etc.</p><h3>Basic Structure</h3><pre><code>&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;title&gt;Page Title&lt;/title&gt;\n  &lt;/head&gt;\n  &lt;body&gt;\n    &lt;h1&gt;My First Heading&lt;/h1&gt;\n    &lt;p&gt;My first paragraph.&lt;/p&gt;\n  &lt;/body&gt;\n&lt;/html&gt;</code></pre>'
          },
          {
            section_id: sectionsData[0].id,
            title: 'HTML Elements',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '12:15',
            order: 2,
            is_free: false,
          },
          {
            section_id: sectionsData[0].id,
            title: 'HTML Attributes',
            video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '9:45',
            order: 3,
            is_free: false,
          }
        ];
        
        const { data: lecturesData, error: lecturesError } = await supabase
          .from('course_lectures')
          .insert(lectures.map(lecture => ({
            ...lecture,
            created_at: new Date().toISOString()
          })));
        
        if (lecturesError) throw lecturesError;
      }
      
      // Create quiz for the first section
      if (sectionsData?.[0]) {
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .insert({
            title: 'HTML Fundamentals Quiz',
            description: 'Test your knowledge of HTML basics',
            section_id: sectionsData[0].id,
            time_limit: 10,
            pass_score: 70,
            created_at: new Date().toISOString()
          })
          .select();
        
        if (quizError) throw quizError;
        
        // Create quiz questions
        if (quizData?.[0]) {
          const questions = [
            {
              quiz_id: quizData[0].id,
              question: 'What does HTML stand for?',
              question_type: 'multiple_choice',
              options: [
                'Hypertext Markup Language',
                'Hypertext Markdown Language',
                'Hyperloop Machine Language',
                'Hypertext Machine Language'
              ],
              correct_answer: 'Hypertext Markup Language',
              explanation: 'HTML stands for Hypertext Markup Language, which is the standard markup language for documents designed to be displayed in a web browser.'
            },
            {
              quiz_id: quizData[0].id,
              question: 'Which HTML element is used to define a paragraph?',
              question_type: 'multiple_choice',
              options: [
                '<p>',
                '<paragraph>',
                '<para>',
                '<text>'
              ],
              correct_answer: '<p>',
              explanation: 'The <p> element is used to define a paragraph in HTML.'
            },
            {
              quiz_id: quizData[0].id,
              question: 'Is HTML a programming language?',
              question_type: 'true_false',
              options: ['true', 'false'],
              correct_answer: 'false',
              explanation: 'HTML is a markup language, not a programming language. It is used to structure content on the web.'
            }
          ];
          
          const { error: questionsError } = await supabase
            .from('quiz_questions')
            .insert(questions.map(question => ({
              ...question,
              created_at: new Date().toISOString()
            })));
          
          if (questionsError) throw questionsError;
        }
      }
    }
    
    // Enroll students in courses
    if (coursesData && studentIds.length > 0) {
      for (let i = 0; i < Math.min(coursesData.length, studentIds.length); i++) {
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .insert({
            course_id: coursesData[i].id,
            user_id: studentIds[i],
            enrolled_at: new Date().toISOString()
          })
          .select();
        
        if (enrollmentError) throw enrollmentError;
        
        if (enrollment?.[0]) {
          await supabase
            .from('course_progress')
            .insert({
              enrollment_id: enrollment[0].id,
              completed_lectures: [],
              progress_percentage: 0,
              updated_at: new Date().toISOString()
            });
        }
      }
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
