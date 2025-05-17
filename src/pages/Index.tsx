
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CategoryFilter from "@/components/CategoryFilter";
import CourseGrid from "@/components/CourseGrid";
import { CourseProgress } from "@/types";
import { mockCourses } from "@/data/mockData";
import { GraduationCap, Search, BookOpen, Users, CheckSquare } from "lucide-react";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  const featuredCourses = mockCourses.slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would navigate to a search results page
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 px-4 md:px-6 lg:py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Transform Your Future with Online Learning
              </h1>
              <p className="text-lg text-muted-foreground">
                Access high-quality courses taught by expert instructors and gain the skills you need for tomorrow's opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <Link to="/explore">Explore Courses</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/signup">Become an Instructor</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Students learning online"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Search form */}
          <div className="mt-12">
            <Card className="bg-card/95 backdrop-blur border">
              <CardContent className="py-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="What do you want to learn?"
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-muted-foreground">Online Courses</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-muted-foreground">Skilled Instructors</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center p-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold">99%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted-foreground mt-1">
                Explore our most popular and highly-rated courses
              </p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0" asChild>
              <Link to="/explore">View All Courses</Link>
            </Button>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
            className="mb-6"
          />

          <CourseGrid
            courses={featuredCourses}
            enrolledCourseIds={[]}
            progress={[]}
          />
        </div>
      </section>

      {/* Becoming an instructor section */}
      <section className="bg-primary/10 py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Become an instructor"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Become an Instructor</h2>
              <p className="text-lg">
                Share your knowledge and expertise with students around the world. Create engaging courses and help others learn while earning income.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Create and publish your courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Engage with a global student community</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckSquare className="h-4 w-4 text-primary" />
                  </div>
                  <span>Earn money through course sales</span>
                </li>
              </ul>
              <Button size="lg" asChild>
                <Link to="/signup">Start Teaching Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground font-bold">
                  EF
                </div>
                <span className="font-semibold text-lg">EduFlow</span>
              </Link>
              <p className="text-muted-foreground">
                Modern learning platform for students and instructors worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Students</h3>
              <ul className="space-y-2">
                <li><Link to="/explore" className="text-muted-foreground hover:text-foreground">Explore Courses</Link></li>
                <li><Link to="/signin" className="text-muted-foreground hover:text-foreground">My Learning</Link></li>
                <li><Link to="/signin" className="text-muted-foreground hover:text-foreground">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Instructors</h3>
              <ul className="space-y-2">
                <li><Link to="/signup" className="text-muted-foreground hover:text-foreground">Start Teaching</Link></li>
                <li><Link to="/instructor-guidelines" className="text-muted-foreground hover:text-foreground">Instructor Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EduFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
