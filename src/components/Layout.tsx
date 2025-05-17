
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1">
        {user && (
          <Sidebar 
            isOpen={sidebarOpen}
            className="fixed md:static md:translate-x-0"
          />
        )}
        
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            user ? "md:ml-64" : ""
          }`}
        >
          {/* Add overlay for mobile when sidebar is open */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-10"
              onClick={toggleSidebar}
            />
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
