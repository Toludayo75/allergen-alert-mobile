import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AllergenBadge } from "@/components/ui/allergen-badge";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { 
  Bell, 
  ChevronRight, 
  LogOut, 
  Shield, 
  Edit,
  Settings,
  Plus
} from "lucide-react";

interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
}

interface Allergen {
  id: number;
  name: string;
}

export default function ProfilePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);

  // Get user data
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ["/api/user"]
  });
  
  // Get user allergens
  const { data: userAllergens, isLoading: isLoadingAllergens } = useQuery<Allergen[]>({
    queryKey: ["/api/user/allergens"],
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Logged out successfully",
      });
      navigate("/login");
    },
    onError: () => {
      toast({
        title: "Failed to logout",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  // Remove allergen mutation
  const removeAllergenMutation = useMutation({
    mutationFn: async (allergenId: number) => {
      const res = await apiRequest("DELETE", `/api/user/allergens/${allergenId}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/allergens"] });
      toast({
        title: "Allergen removed",
        description: "Your allergen preferences have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Failed to remove allergen",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleRemoveAllergen = (allergenId: number) => {
    removeAllergenMutation.mutate(allergenId);
  };

  // Loading placeholders
  if (isLoadingUser) {
    return <div className="min-h-full flex items-center justify-center">Loading profile...</div>;
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="mb-6">
        {/* Header with settings icon */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-6 w-6 text-neutral-700" />
          </Button>
        </div>
      
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex-shrink-0 flex items-center justify-center mr-3 text-white font-bold text-xl">
              {getInitials(user?.fullName || '')}
            </div>
            <div className="flex-1">
              <h3 className="font-nunito font-bold text-lg">{user?.fullName}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-primary flex items-center"
                onClick={() => navigate("/profile/edit")}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* My Allergens */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-nunito font-semibold text-lg">My Allergens</h3>
            <Button 
              variant="ghost" 
              className="text-secondary font-medium text-sm flex items-center p-1"
              onClick={() => navigate("/profile/allergens")}
            >
              <Plus className="h-5 w-5 mr-1" />
              Add
            </Button>
          </div>
          
          {isLoadingAllergens ? (
            <div className="text-center py-2">Loading allergens...</div>
          ) : userAllergens && Array.isArray(userAllergens) && userAllergens.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-3">
              {userAllergens.map((allergen: any) => (
                <AllergenBadge
                  key={allergen.id}
                  name={allergen.name}
                  isDangerous={true}
                  onRemove={() => handleRemoveAllergen(allergen.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-3">No allergens selected yet.</p>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="font-nunito font-semibold text-lg mb-3">Account</h3>
          <div className="space-y-3">
            <div 
              className="flex items-center justify-between p-2 cursor-pointer"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5 text-neutral-500 mr-3" />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
