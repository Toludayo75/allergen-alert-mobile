import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AllergenBadge } from "@/components/ui/allergen-badge";
import { AllergenCard } from "@/components/ui/allergen-card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { commonAllergens, getAllergenIcon } from "@/assets/allergens";
import { X, Plus } from "lucide-react";

interface Allergen {
  id: number;
  name: string;
}

export default function AllergenManagementPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);

  // Get all available allergens
  const { data: availableAllergens } = useQuery<Allergen[]>({
    queryKey: ["/api/allergens"]
  });

  // Get user allergens
  const { data: userAllergens, isLoading: isLoadingAllergens } = useQuery<Allergen[]>({
    queryKey: ["/api/user/allergens"],
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
  
  // Add allergen mutation
  const addAllergenMutation = useMutation({
    mutationFn: async (allergenIds: number[]) => {
      const res = await apiRequest("POST", "/api/user/allergens", { allergenIds });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/allergens"] });
      setSelectedAllergens([]);
      toast({
        title: "Allergens added",
        description: "Your allergen preferences have been updated",
      });
      navigate("/profile");
    },
    onError: () => {
      toast({
        title: "Failed to add allergens",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleRemoveAllergen = (allergenId: number) => {
    removeAllergenMutation.mutate(allergenId);
  };
  
  const handleToggleAllergen = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedAllergens(prev => prev.filter(allergenId => allergenId !== id));
    } else {
      setSelectedAllergens(prev => [...prev, id]);
    }
  };
  
  const handleAddAllergens = () => {
    if (selectedAllergens.length > 0) {
      addAllergenMutation.mutate(selectedAllergens);
    } else {
      toast({
        title: "No allergens selected",
        description: "Please select at least one allergen",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-full flex flex-col p-4">
      {/* My Allergens */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <h3 className="font-nunito font-semibold text-lg mb-3">My Allergens</h3>
        {isLoadingAllergens ? (
          <div className="text-center py-2">Loading allergens...</div>
        ) : userAllergens && userAllergens.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-3">
            {userAllergens.map((allergen) => (
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
      
      {/* Allergen Selector Section */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-nunito font-semibold text-lg">Select Allergens</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {availableAllergens && Array.isArray(availableAllergens) && availableAllergens.length > 0 ? (
            availableAllergens.map((allergen: any) => {
              const isSelected = selectedAllergens.includes(allergen.id);
              return (
                <AllergenCard
                  key={allergen.id}
                  id={allergen.id}
                  name={allergen.name}
                  icon={getAllergenIcon(allergen.name?.toLowerCase() || 'default')}
                  selected={isSelected}
                  onClick={(id, selected) => handleToggleAllergen(id, selected)}
                />
              );
            })
          ) : (
            // If no allergens are available, show the common allergens from the static list
            commonAllergens.map((allergen: any, index: number) => {
              const isSelected = selectedAllergens.includes(index);
              return (
                <AllergenCard
                  key={index}
                  id={index}
                  name={allergen.name}
                  icon={getAllergenIcon(allergen.icon || 'default')}
                  selected={isSelected}
                  onClick={(id, selected) => handleToggleAllergen(id, selected)}
                />
              );
            })
          )}
        </div>
        <div className="text-sm mb-2 text-gray-500">
          Selected {selectedAllergens.length} allergen(s)
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-green-400 hover:bg-green-500 text-white"
            onClick={handleAddAllergens}
            disabled={selectedAllergens.length === 0 || addAllergenMutation.isPending}
          >
            {addAllergenMutation.isPending ? 'Saving...' : 'Save Allergens'}
          </Button>
        </div>
      </div>
    </div>
  );
}