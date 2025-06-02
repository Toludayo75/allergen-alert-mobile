import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
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
import { AllergenCard } from "@/components/ui/allergen-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getAllergenIcon } from "@/assets/allergens";

// Registration form schema
const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = account info, 2 = allergen selection
  const [formData, setFormData] = useState<RegisterForm | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);

  // Initialize form
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  // Fetch allergens for step 2
  const { data: allergens, isLoading: isLoadingAllergens } = useQuery<any[]>({
    queryKey: ["/api/allergens"],
    enabled: step === 2, // Only fetch when on allergen step
  });

  // Register mutation - creates account and saves allergens
  const registerMutation = useMutation({
    mutationFn: async (data: { formData: RegisterForm; allergenIds: number[] }) => {
      // First create the account
      const registerRes = await apiRequest("POST", "/api/register", data.formData);
      const user = await registerRes.json();
      
      // Then save allergens if any selected
      if (data.allergenIds.length > 0) {
        await apiRequest("POST", "/api/user/allergens", { allergenIds: data.allergenIds });
      }
      
      return user;
    },
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "Your account and allergen profile have been created.",
      });
      navigate("/registration-complete");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Handle step 1 form submission (account info)
  const onSubmitAccountInfo = (data: RegisterForm) => {
    setFormData(data);
    setStep(2); // Move to allergen selection
  };

  // Toggle allergen selection
  const toggleAllergen = (id: number, currentlySelected: boolean) => {
    if (currentlySelected) {
      // If currently selected, remove it
      setSelectedAllergens(prev => prev.filter(allergenId => allergenId !== id));
    } else {
      // If not currently selected, add it
      setSelectedAllergens(prev => [...prev, id]);
    }
  };

  // Handle final registration (with allergens)
  const handleFinalRegistration = () => {
    if (!formData) return;
    setLoading(true);
    registerMutation.mutate({ formData, allergenIds: selectedAllergens });
  };

  // Calculate progress
  const progress = step === 1 ? 20 : 60;

  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-neutral-200 h-2 rounded-full mb-8">
          <div className="progress-bar bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-nunito font-bold mb-6">Create your account</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitAccountInfo)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Enter your email" 
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username" 
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                          {...field} 
                        />
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
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md mt-6"
                >
                  Continue
                </Button>
              </form>
            </Form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-nunito font-bold mb-2">Select Your Allergens</h2>
            <p className="text-gray-600 mb-6">Tap all allergens that affect you</p>

            {isLoadingAllergens ? (
              <div className="text-center py-8">Loading allergens...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(allergens || []).map((allergen: any) => {
                  const isSelected = selectedAllergens.includes(allergen.id);
                  return (
                    <AllergenCard
                      key={allergen.id}
                      id={allergen.id}
                      name={allergen.name}
                      icon={getAllergenIcon(allergen.icon || 'default')}
                      selected={isSelected}
                      onClick={toggleAllergen}
                    />
                  );
                })}
              </div>
            )}

            <div className="space-y-3">
              <Button 
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md"
                disabled={loading || isLoadingAllergens}
                onClick={handleFinalRegistration}
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}