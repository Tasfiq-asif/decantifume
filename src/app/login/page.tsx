"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Eye, EyeOff, Mail, Lock, Shield, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push("/");
        router.refresh();
      }
      // Error handling is done by useAuth hook and displayed via the error state
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Demo credential functions
  const fillAdminCredentials = () => {
    setFormData({
      email: "admin@decant.com",
      password: "Password123",
    });
    // Clear any existing errors
    setFormErrors({});
  };

  const fillUserCredentials = () => {
    setFormData({
      email: "test@example.com",
      password: "Password123",
    });
    // Clear any existing errors
    setFormErrors({});
  };

  return (
    <SiteLayout>
      <div className="flex items-center justify-center bg-gradient-to-br from-dark-purple-950 via-dark-purple-900 to-dark-purple-800 py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-200px)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-radial-lavender opacity-30" />
        <div className="absolute inset-0 bg-subtle-glow opacity-20" />

        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-lavender-100 via-lavender-200 to-lavender-300 bg-clip-text text-transparent">
              DECANT
            </h2>
            <p className="mt-2 text-sm text-lavender-200">
              Welcome back! Please sign in to your account.
            </p>
          </div>

          <Card className="glass-effect border-lavender-400/20 shadow-lavender-soft backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pl-10 ${
                        formErrors.email ? "border-destructive" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-sm text-destructive">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${
                        formErrors.password ? "border-destructive" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-sm text-destructive">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>

              <Separator className="my-6" />

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>

              <Separator className="my-4" />

              {/* Demo Credentials Section */}
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center font-medium">
                  Quick Demo Login:
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fillAdminCredentials}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/20 hover:bg-red-500/20 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fillUserCredentials}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    User Login
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Click to auto-fill credentials for testing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
