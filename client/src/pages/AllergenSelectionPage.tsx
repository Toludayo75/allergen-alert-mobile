import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AllergenCard } from "@/components/ui/allergen-card";
import { useToast } from "@/hooks/use-toast";
import { useAllergens } from "@/hooks/use-allergens";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAllergenIcon } from "@/assets/allergens";

export default function AllergenSelectionPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch allergens
  const { data: allergens, isLoading: isLoadingAllergens } = useQuery({
    queryKey: ["/api/allergens"],
  });

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  // Save allergens mutation
  const saveAllergensMutation = useMutation({
    mutationFn: async (allergenIds: number[]) => {
      const res = await apiRequest("POST", "/api/user/allergens", { allergenIds });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Allergens saved",
        description: "Your allergen preferences have been saved",
      });
      navigate("/registration-complete");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save allergens",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Toggle allergen selection
  const toggleAllergen = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedAllergens(prev => [...prev, id]);
    } else {
      setSelectedAllergens(prev => prev.filter(allergenId => allergenId !== id));
    }
  };

  const handleContinue = () => {
    setLoading(true);
    saveAllergensMutation.mutate(selectedAllergens);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoadingAllergens) {
      navigate("/register");
    }
  }, [user, isLoadingAllergens, navigate]);

  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Progress Bar - Duolingo Style */}
        <div className="w-full bg-neutral-200 h-2 rounded-full mb-8">
          <div className="progress-bar bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
        </div>

        <h2 className="text-2xl font-nunito font-bold mb-2">Select Your Allergens</h2>
        <p className="text-gray-600 mb-6">Tap all allergens that affect you</p>

        {/* Allergen Selection Grid - Duolingo Style */}
        {isLoadingAllergens ? (
          <div className="text-center py-8">Loading allergens...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {allergens?.map((allergen: any) => (
              <AllergenCard
                key={allergen.id}
                id={allergen.id}
                name={allergen.name}
                icon={getAllergenIcon(allergen.icon)}
                onClick={toggleAllergen}
              />
            ))}
          </div>
        )}

        <Button 
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md"
          disabled={loading || isLoadingAllergens}
          onClick={handleContinue}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
