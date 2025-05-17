
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SignIn = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the redirect URL from the location state
  const from = (location.state as { from?: string })?.from || "/dashboard";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      await signIn(values.email, values.password);
      // Sign in successful, navigate to redirect URL or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      // Error is already handled in the auth context with toast
      console.error("Sign in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md flex items-center justify-center bg-primary text-primary-foreground font-bold text-xl">
                EF
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
          
          {/* Demo accounts */}
          <div className="mt-6">
            <p className="text-sm text-center text-muted-foreground mb-3">Demo Accounts</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  form.setValue("email", "student@example.com");
                  form.setValue("password", "password123");
                }}
              >
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">Student</span>
                student@example.com
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  form.setValue("email", "instructor@example.com");
                  form.setValue("password", "password123");
                }}
              >
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">Instructor</span>
                instructor@example.com
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  form.setValue("email", "admin@example.com");
                  form.setValue("password", "password123");
                }}
              >
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs mr-2">Admin</span>
                admin@example.com
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
