
// Dummy data for use when database connections are not available
import { Course, CourseProgress, CourseSection, CourseLecture } from "@/types";

export const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn full-stack web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js and database management.",
    thumbnail_url: "https://images.unsplash.com/photo-1605379399843-5870eea9b74e?q=80&w=2400&auto=format&fit=crop",
    instructor_id: "1",
    instructor_name: "Jane Smith",
    price: 49.99,
    rating: 4.8,
    total_students: 12453,
    total_reviews: 2546,
    total_lectures: 68,
    duration: "42 hours",
    level: "all-levels",
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-05-10T14:30:00Z",
    categories: ["web-development", "programming"]
  },
  {
    id: "2",
    title: "Advanced React and Redux",
    description: "Take your React skills to the next level with advanced patterns, hooks, and state management using Redux.",
    thumbnail_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2400&auto=format&fit=crop",
    instructor_id: "2",
    instructor_name: "Michael Johnson",
    price: 59.99,
    rating: 4.9,
    total_students: 8765,
    total_reviews: 1934,
    total_lectures: 54,
    duration: "38 hours",
    level: "intermediate",
    created_at: "2025-02-10T10:00:00Z",
    updated_at: "2025-04-28T16:45:00Z",
    categories: ["react", "javascript", "web-development"]
  },
  {
    id: "3",
    title: "Python for Data Science and Machine Learning",
    description: "Learn Python programming and its applications in data analysis, visualization, and building machine learning models.",
    thumbnail_url: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2400&auto=format&fit=crop",
    instructor_id: "3",
    instructor_name: "Sarah Williams",
    price: 69.99,
    rating: 4.7,
    total_students: 15632,
    total_reviews: 3241,
    total_lectures: 72,
    duration: "45 hours",
    level: "beginner",
    created_at: "2025-03-05T10:00:00Z",
    updated_at: "2025-05-15T09:20:00Z",
    categories: ["python", "data-science", "machine-learning"]
  }
];

export const dummySections: Record<string, CourseSection[]> = {
  "1": [
    {
      id: "s1",
      course_id: "1",
      title: "Introduction to Web Development",
      order: 1
    },
    {
      id: "s2",
      course_id: "1",
      title: "HTML Fundamentals",
      order: 2
    },
    {
      id: "s3",
      course_id: "1",
      title: "CSS Styling and Layout",
      order: 3
    },
    {
      id: "s4",
      course_id: "1",
      title: "JavaScript Basics",
      order: 4
    },
    {
      id: "s5",
      course_id: "1",
      title: "Building Interactive Web Applications",
      order: 5
    }
  ],
  "2": [
    {
      id: "s6",
      course_id: "2",
      title: "React Hooks Deep Dive",
      order: 1
    },
    {
      id: "s7",
      course_id: "2",
      title: "Redux State Management",
      order: 2
    },
    {
      id: "s8",
      course_id: "2",
      title: "Advanced Component Patterns",
      order: 3
    }
  ],
  "3": [
    {
      id: "s9",
      course_id: "3",
      title: "Python Basics",
      order: 1
    },
    {
      id: "s10",
      course_id: "3",
      title: "Data Analysis with Pandas",
      order: 2
    },
    {
      id: "s11",
      course_id: "3",
      title: "Data Visualization",
      order: 3
    },
    {
      id: "s12",
      course_id: "3",
      title: "Machine Learning Fundamentals",
      order: 4
    }
  ]
};

export const dummyLectures: Record<string, CourseLecture[]> = {
  "s1": [
    {
      id: "l1",
      section_id: "s1",
      title: "Course Overview",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "10:15",
      order: 1,
      is_free: true
    },
    {
      id: "l2",
      section_id: "s1",
      title: "Setting Up Your Development Environment",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "15:30",
      order: 2,
      is_free: true
    }
  ],
  "s2": [
    {
      id: "l3",
      section_id: "s2",
      title: "HTML Structure and Elements",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "20:45",
      order: 1,
      is_free: false
    },
    {
      id: "l4",
      section_id: "s2",
      title: "HTML Forms and Inputs",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "18:20",
      order: 2,
      is_free: false
    }
  ],
  "s3": [
    {
      id: "l5",
      section_id: "s3",
      title: "CSS Selectors and Properties",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "22:10",
      order: 1,
      is_free: false
    },
    {
      id: "l6",
      section_id: "s3",
      title: "Flexbox Layout",
      video_url: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
      duration: "25:30",
      order: 2,
      is_free: false
    }
  ]
};

export const dummyProgress: CourseProgress[] = [
  {
    course_id: "1",
    user_id: "current-user",
    completed_lectures: ["l1", "l2"],
    progress_percentage: 25,
    last_watched_lecture: "l2",
    started_at: "2025-05-01T10:00:00Z",
    updated_at: "2025-05-10T15:30:00Z"
  }
];
