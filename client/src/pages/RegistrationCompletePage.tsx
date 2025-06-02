import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function RegistrationCompletePage() {
  const [, navigate] = useLocation();

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/register");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-full flex flex-col p-4 justify-center items-center">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Progress Bar - Duolingo Style */}
        <div className="w-full bg-neutral-200 h-2 rounded-full mb-8">
          <div className="progress-bar bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
        </div>

        <div className="mb-8">
          <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCheck className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-nunito font-bold mb-2">Registration Complete!</h2>
          <p className="text-gray-600">Your allergen profile has been created</p>
        </div>

        <Button 
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md"
          onClick={() => navigate("/home")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
