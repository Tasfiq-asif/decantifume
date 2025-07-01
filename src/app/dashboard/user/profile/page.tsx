"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { User, MapPin, Save, ArrowLeft, Camera } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export default function UserProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  // Helper function to get auth token
  const getAuthToken = async () => {
    if (typeof window !== "undefined") {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      return session?.accessToken || "";
    }
    return "";
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const authToken = await getAuthToken();
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      // Set profile data with fallbacks
      setProfile({
        name: data.data?.name || user?.name || "",
        email: data.data?.email || user?.email || "",
        phone: data.data?.phone || "",
        dateOfBirth: data.data?.dateOfBirth || "",
        address: {
          street: data.data?.address?.street || "",
          city: data.data?.address?.city || "",
          state: data.data?.address?.state || "",
          zipCode: data.data?.address?.zipCode || "",
          country: data.data?.address?.country || "",
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Use available user data as fallback
      setProfile((prev) => ({
        ...prev,
        name: user?.name || "",
        email: user?.email || "",
      }));
      console.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async () => {
    try {
      setSaving(true);
      const authToken = await getAuthToken();
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    fetchUserProfile();
  }, [isAuthenticated, user?.role, authLoading]);

  if (loading) {
    return <Loading fullscreen message="Loading your profile..." />;
  }

  const handleInputChange = (
    field: keyof UserProfile | string,
    value: string
  ) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "address") {
        setProfile((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value,
          },
        }));
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/user")}
            className="text-lavender-300 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-lavender-200">
          Update your personal information and delivery address
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-lavender-600 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="absolute -bottom-2 -right-2 bg-dark-purple-600 hover:bg-dark-purple-700 rounded-full p-2"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <h3 className="text-white font-medium">
                  {profile.name || "User"}
                </h3>
                <p className="text-lavender-300 text-sm">
                  Member since {new Date().getFullYear()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-lavender-300">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-lavender-300">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-lavender-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth" className="text-lavender-300">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="street" className="text-lavender-300">
                Street Address
              </Label>
              <Input
                id="street"
                type="text"
                value={profile.address.street}
                onChange={(e) =>
                  handleInputChange("address.street", e.target.value)
                }
                className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-lavender-300">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={profile.address.city}
                  onChange={(e) =>
                    handleInputChange("address.city", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="New York"
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-lavender-300">
                  State/Province
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={profile.address.state}
                  onChange={(e) =>
                    handleInputChange("address.state", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="zipCode" className="text-lavender-300">
                  ZIP/Postal Code
                </Label>
                <Input
                  id="zipCode"
                  type="text"
                  value={profile.address.zipCode}
                  onChange={(e) =>
                    handleInputChange("address.zipCode", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="10001"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-lavender-300">
                  Country
                </Label>
                <Input
                  id="country"
                  type="text"
                  value={profile.address.country}
                  onChange={(e) =>
                    handleInputChange("address.country", e.target.value)
                  }
                  className="bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                  placeholder="United States"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/dashboard/user")}
            className="text-lavender-300 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-lavender-600 hover:bg-lavender-700 text-white min-w-32"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
