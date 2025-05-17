
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  GraduationCap,
  Home,
  BarChart3,
  Users,
  Settings,
  User as UserIcon,
  CheckSquare,
  FileText,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, className }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Generate navigation links based on user role
  const navLinks = useMemo(() => {
    const links = [
      {
        label: "Home",
        href: "/",
        icon: <Home className="h-5 w-5" />,
      },
    ];
    
    if (user) {
      // Links for all authenticated users
      links.push(
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <Home className="h-5 w-5" />,
        },
        {
          label: "My Courses",
          href: "/my-courses",
          icon: <BookOpen className="h-5 w-5" />,
        }
      );
      
      // Links for instructors
      if (user.role === "instructor" || user.role === "admin") {
        links.push(
          {
            label: "Create Course",
            href: "/create-course",
            icon: <Plus className="h-5 w-5" />,
          },
          {
            label: "My Teachings",
            href: "/my-teachings",
            icon: <GraduationCap className="h-5 w-5" />,
          }
        );
      }
      
      // Links for admins
      if (user.role === "admin") {
        links.push(
          {
            label: "Users",
            href: "/admin/users",
            icon: <Users className="h-5 w-5" />,
          },
          {
            label: "Analytics",
            href: "/admin/analytics",
            icon: <BarChart3 className="h-5 w-5" />,
          }
        );
      }
      
      // Profile and settings for all authenticated users
      links.push(
        {
          label: "Profile",
          href: "/profile",
          icon: <UserIcon className="h-5 w-5" />,
        },
        {
          label: "Settings",
          href: "/settings",
          icon: <Settings className="h-5 w-5" />,
        }
      );
    } else {
      // Links for unauthenticated users
      links.push(
        {
          label: "Explore",
          href: "/explore",
          icon: <BookOpen className="h-5 w-5" />,
        }
      );
    }
    
    return links;
  }, [user]);
  
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-background border-r transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        className
      )}
    >
      {/* Sidebar header */}
      <div className="p-4 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground font-bold">
            EF
          </div>
          <span className="font-semibold text-lg">EduFlow</span>
        </Link>
      </div>
      
      <Separator />
      
      {/* User info */}
      {user && (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              <AvatarFallback>
                {user.first_name.charAt(0) + user.last_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{user.first_name} {user.last_name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navLinks.map((link) => (
          <Button
            key={link.href}
            variant="ghost"
            asChild
            className={cn(
              "justify-start w-full",
              location.pathname === link.href && "bg-accent text-accent-foreground"
            )}
          >
            <Link to={link.href} className="flex items-center gap-2">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </Button>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 mt-auto">
        <Separator className="mb-4" />
        {user ? (
          <div className="text-xs text-muted-foreground">
            <span>Logged in as </span>
            <span className="font-medium capitalize">{user.role}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
