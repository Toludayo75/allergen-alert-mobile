import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck } from "lucide-react";

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/home");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col p-4 justify-center items-center">
      <div className="mb-8 text-center">
        {/* App logo */}
        <div className="w-32 h-32 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center">
          <ShieldCheck className="h-20 w-20 text-white" />
        </div>
        <h1 className="text-3xl font-nunito font-bold text-primary mb-2">Allergen Alert</h1>
        <p className="text-gray-600">Your food safety companion</p>
      </div>
      <div className="w-full max-w-sm">
        <Button 
          className="w-full bg-primary text-white font-semibold py-3 rounded-lg mb-4 shadow-md"
          size="lg"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
        <Button 
          className="w-full bg-white border-2 border-primary text-primary font-semibold py-3 rounded-lg shadow-sm"
          variant="outline"
          size="lg"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
