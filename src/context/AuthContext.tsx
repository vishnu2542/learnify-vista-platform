
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { mockUsers } from "../data/mockData";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, firstName: string, lastName: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => void;
  updateProfile: (updatedUser: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("lms_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        // In a real app, we'd verify the password here
        setUser(foundUser);
        localStorage.setItem("lms_user", JSON.stringify(foundUser));
        toast.success("Successfully signed in!");
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock sign up function
  const signUp = async (email: string, firstName: string, lastName: string, password: string, role: UserRole) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with this email already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${Date.now().toString()}`,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        created_at: new Date().toISOString(),
      };
      
      setUser(newUser);
      localStorage.setItem("lms_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("lms_user");
    toast.success("You have been signed out");
  };

  // Update profile function
  const updateProfile = async (updatedUser: Partial<User>) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) throw new Error("No user is signed in");
      
      const newUserData = { ...user, ...updatedUser };
      setUser(newUserData);
      localStorage.setItem("lms_user", JSON.stringify(newUserData));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
