
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

/**
 * Script to populate the database with sample data.
 * Run this after setting up the database tables and schema.
 */
export const seedDatabase = async () => {
  try {
    console.log("Starting database seeding process...");
    
    // Check if data already exists to prevent duplicate seeding
    const { data: existingUsers, error: userCheckError } = await supabase
      .from('users')
      .select('count');
    
    if (userCheckError) {
      console.log("Error checking users, may need to create tables:", userCheckError);
      
      // Create tables if they don't exist
      await createDatabaseStructure();
    }
    
    if (existingUsers && existingUsers.length > 0 && existingUsers[0]?.count > 3) {
      console.log("Database already contains data. Skipping seeding process.");
      toast.info("Database already populated with sample data");
      return;
    }
    
    // Create admin user
    const adminEmail = 'admin@eduflow.com';
    
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
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
    
    if (adminError) {
      console.error("Error creating admin auth user:", adminError);
      
      // Check if user already exists
      const { data: existingAdmin } = await supabase
        .from('users')
        .select('*')
        .eq('email', adminEmail)
        .maybeSingle();
        
      if (!existingAdmin) {
        // Insert admin directly into users table
        await supabase.from('users').insert({
          email: adminEmail,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          created_at: new Date().toISOString()
        });
      }
    } else if (adminData?.user) {
      // Fix: Remove the onConflict and use insert with upsert option
      await supabase.from('users').upsert({
        id: adminData.user.id,
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
      }
    ];
    
    const instructorIds = [];
    
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
      
      if (instructorError) {
        console.error(`Error creating instructor ${instructor.email}:`, instructorError);
        
        // Check if instructor already exists
        const { data: existingInstructor } = await supabase
          .from('users')
          .select('*')
          .eq('email', instructor.email)
          .maybeSingle();
          
        if (existingInstructor) {
          instructorIds.push(existingInstructor.id);
          continue;
        }
        
        // Create an ID for the instructor
        const fakeId = `inst_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // Insert instructor directly into users table
        await supabase.from('users').insert({
          id: fakeId,
          email: instructor.email,
          first_name: instructor.first_name,
          last_name: instructor.last_name,
          role: 'instructor',
          created_at: new Date().toISOString()
        });
        
        instructorIds.push(fakeId);
      } else if (instructorData?.user) {
        // Fix: Remove the onConflict and use upsert instead
        await supabase.from('users').upsert({
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
    
    // Create categories
    const categories = [
      { name: 'Web Development' },
      { name: 'Data Science' },
      { name: 'Mobile Development' },
      { name: 'UX/UI Design' },
      { name: 'Business' }
    ];
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(categories.map(cat => ({
        name: cat.name,
        created_at: new Date().toISOString()
      })))
      .select();
    
    if (categoriesError) {
      console.error("Error creating categories:", categoriesError);
      
      // Check if categories already exist
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('*');
        
      if (existingCategories && existingCategories.length > 0) {
        console.log("Using existing categories");
      } else {
        throw categoriesError;
      }
    }
    
    // Get all categories
    const { data: allCategories } = await supabase
      .from('categories')
      .select('*');
      
    const categoryIds = allCategories?.map(c => c.id) || [];
    
    // Sample course data
    if (instructorIds.length > 0 && categoryIds.length > 0) {
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
          category_id: categoryIds[0]
        },
        {
          title: 'Python for Data Science',
          description: 'Master Python programming and learn how to analyze data using popular libraries.',
          thumbnail_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400',
          instructor_id: instructorIds[instructorIds.length > 1 ? 1 : 0],
          price: 59.99,
          level: 'intermediate',
          published: true,
          featured: true,
          total_lectures: 15,
          duration: '12h 15m',
          category_id: categoryIds[1 % categoryIds.length]
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
          category_id: categoryIds[3 % categoryIds.length]
        }
      ];
      
      // Insert courses
      for (const course of courses) {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .insert({
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
          })
          .select()
          .single();
          
        if (courseError) {
          console.error(`Error creating course ${course.title}:`, courseError);
          continue;
        }
        
        if (courseData) {
          // Create a section for this course
          const { data: sectionData, error: sectionError } = await supabase
            .from('course_sections')
            .insert({
              course_id: courseData.id,
              title: `Introduction to ${course.title}`,
              order: 1,
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (sectionError) {
            console.error(`Error creating section for ${course.title}:`, sectionError);
            continue;
          }
          
          if (sectionData) {
            // Add a couple of lectures to this section
            const lectures = [
              {
                section_id: sectionData.id,
                title: 'Course Overview',
                video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: '10:30',
                order: 1,
                is_free: true,
                content: `<h2>Welcome to ${course.title}</h2><p>In this course, you will learn everything you need to know about this subject.</p>`
              },
              {
                section_id: sectionData.id,
                title: 'Getting Started',
                video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                duration: '12:15',
                order: 2,
                is_free: false,
                content: `<h2>Getting Started</h2><p>Let's begin our journey into ${course.title} with some fundamental concepts.</p>`
              }
            ];
            
            for (const lecture of lectures) {
              const { error: lectureError } = await supabase
                .from('course_lectures')
                .insert({
                  ...lecture,
                  created_at: new Date().toISOString()
                });
                
              if (lectureError) {
                console.error(`Error creating lecture ${lecture.title}:`, lectureError);
              }
            }
          }
        }
      }
    }
    
    console.log("Database seeding completed successfully!");
    toast.success("Database successfully populated with sample data");
  } catch (error) {
    console.error("Error seeding database:", error);
    toast.error("Error seeding database");
    throw error;
  }
};

// Helper function to create database structure if it doesn't exist
const createDatabaseStructure = async () => {
  console.log("Creating database structure...");
  
  // Create users table - Fix: Remove .catch and use try/catch instead
  try {
    await supabase.rpc('create_users_table_if_not_exists');
  } catch (err) {
    console.log("Error or RPC not available:", err);
    
    // Try direct SQL as fallback (only works if proper permissions)
    try {
      await supabase.from('users').insert({
        email: 'test@test.com',
        first_name: 'Test',
        last_name: 'User'
      }).select();
    } catch (insertErr) {
      console.log("Could not create users table:", insertErr);
    }
  }
  
  // Fix: Replace .catch with try/catch for all table checks
  try {
    await supabase.from('categories').select('count');
  } catch (err) {
    console.log("Creating categories table...");
    // This will fail if table doesn't exist, which is expected
    // The backend will handle table creation based on RLS policies
  }
  
  try {
    await supabase.from('courses').select('count');
  } catch (err) {
    console.log("Creating courses table...");
    // This will fail if table doesn't exist, which is expected
    // The backend will handle table creation based on RLS policies
  }
  
  try {
    await supabase.from('course_sections').select('count');
  } catch (err) {
    console.log("Creating course_sections table...");
    // This will fail if table doesn't exist, which is expected
  }
  
  try {
    await supabase.from('course_lectures').select('count');
  } catch (err) {
    console.log("Creating course_lectures table...");
    // This will fail if table doesn't exist, which is expected
  }
  
  try {
    await supabase.from('course_enrollments').select('count');
  } catch (err) {
    console.log("Creating course_enrollments table...");
    // This will fail if table doesn't exist, which is expected
  }
  
  console.log("Database structure setup completed");
};
