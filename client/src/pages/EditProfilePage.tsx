import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
}

export default function EditProfilePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: ""
  });

  // Get user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/user"]
  });
  
  // Effect to set form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        username: user.username || ""
      });
    }
  }, [user]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { fullName: string; email: string }) => {
      const res = await apiRequest("PATCH", "/api/user", profileData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully"
      });
      navigate("/profile");
    },
    onError: () => {
      toast({
        title: "Failed to update profile",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate({
      fullName: formData.fullName,
      email: formData.email
    });
  };

  // Loading placeholders
  if (isLoadingUser) {
    return <div className="min-h-full flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h3 className="font-nunito font-bold text-lg mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username (cannot be changed)
            </label>
            <Input
              id="username"
              value={formData.username}
              disabled
              className="w-full bg-gray-100"
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}