"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { authAPI, RegisterData } from "@/lib/api/auth";
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
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [session, status, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    // Clear general error and success messages
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const registerData: RegisterData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await authAPI.register(registerData);

      if (response.success) {
        setSuccess(
          "Registration successful! Please log in with your credentials."
        );
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
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
              Create your account to get started.
            </p>
          </div>

          <Card className="glass-effect border-lavender-400/20 shadow-lavender-soft backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 ${
                        formErrors.name ? "border-destructive" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-sm text-destructive">
                      {formErrors.name}
                    </p>
                  )}
                </div>

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

                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${
                        formErrors.confirmPassword ? "border-destructive" : ""
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
