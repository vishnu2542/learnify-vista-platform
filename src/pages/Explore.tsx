
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import CategoryFilter from "@/components/CategoryFilter";
import CourseGrid from "@/components/CourseGrid";
import { Course } from "@/types";
import { mockCourses } from "@/data/mockData";
import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Explore = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("q") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(mockCourses);
  const [loading, setLoading] = useState(true);
  
  // Filter controls
  const [level, setLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  
  // Filter and search logic
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let results = [...mockCourses];
      
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(
          (course) =>
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.instructor_name.toLowerCase().includes(query) ||
            course.categories?.some((cat) => cat.toLowerCase().includes(query)) ||
            course.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      
      // Category filter
      if (selectedCategory !== "All Categories") {
        results = results.filter((course) =>
          course.categories?.includes(selectedCategory)
        );
      }
      
      // Level filter
      if (level !== "all") {
        results = results.filter((course) => course.level === level);
      }
      
      // Price filter
      results = results.filter(
        (course) => 
          (course.price || 0) >= priceRange[0] && 
          (course.price || 0) <= priceRange[1]
      );
      
      // Sorting
      results = [...results].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return (a.price || 0) - (b.price || 0);
          case "price-high":
            return (b.price || 0) - (a.price || 0);
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "oldest":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "popularity":
          default:
            return (b.total_students || 0) - (a.total_students || 0);
        }
      });
      
      setFilteredCourses(results);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, level, sortBy, priceRange]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  const resetFilters = () => {
    setLevel("all");
    setSortBy("popularity");
    setPriceRange([0, 100]);
    setSelectedCategory("All Categories");
  };
  
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Courses</h1>
          <p className="text-muted-foreground">
            Browse through our wide range of courses
          </p>
        </div>
        
        {/* Mobile filter button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden mt-4">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter Courses</SheetTitle>
              <SheetDescription>
                Refine your search with these filters
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <div className="space-y-6">
                {/* Level filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={level}
                    onValueChange={setLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="all-levels">All Levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort by */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Price range */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Price Range</label>
                    <span className="text-sm text-muted-foreground">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={setPriceRange}
                  />
                </div>
                
                {/* Reset filters */}
                <Button variant="outline" className="w-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters - desktop */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Filters</h3>
            
            {/* Search input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            {/* Level filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select
                value={level}
                onValueChange={setLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort by */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Price range */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Price Range</label>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={100}
                step={5}
                onValueChange={setPriceRange}
              />
            </div>
            
            {/* Reset filters */}
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Courses grid */}
        <div className="md:col-span-3 space-y-6">
          {/* Mobile search bar */}
          <div className="md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          
          {/* Categories */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
          
          {/* Results info */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"} found
            </span>
          </div>
          
          {/* Courses grid */}
          <CourseGrid
            courses={filteredCourses}
            loading={loading}
            emptyMessage="No courses match your search criteria. Try adjusting your filters."
          />
        </div>
      </div>
    </div>
  );
};

export default Explore;
