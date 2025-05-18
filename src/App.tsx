
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import { CourseProvider } from "./context/CourseContext";

// Pages
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import CourseLearning from "./pages/CourseLearning";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CourseProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/course/:courseId" element={<CourseDetail />} />
                <Route path="/course/:courseId/learn" element={<CourseLearning />} />
                <Route path="/course/:courseId/learn/:lectureId" element={<CourseLearning />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-courses" element={<Dashboard />} />
                {/* Other protected routes would go here */}
              </Route>
              
              {/* Auth pages without header/sidebar */}
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CourseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
