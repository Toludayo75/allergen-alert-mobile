import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import BottomNavigation from "./BottomNavigation";
import { ArrowLeft, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  const [showBackButton, setShowBackButton] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    // Determine whether to show back button and navigation based on route
    const publicRoutes = ["/", "/welcome", "/login", "/register", "/registration-complete"];    
    // Show back button only for authenticated users and not on welcome/home/login pages
    setShowBackButton(isAuthenticated && location !== "/" && location !== "/home" && location !== "/welcome" && location !== "/login");
    
    // Show navigation only on authenticated routes and not for admin users
    setShowNavigation(isAuthenticated && !isAdmin && !publicRoutes.includes(location));
  }, [location, isAuthenticated, isAdmin]);

  const handleBackClick = () => {
    if (location === "/allergen-selection") {
      navigate("/register");
    } else if (location === "/registration-complete") {
      navigate("/allergen-selection");
    } else if (location.startsWith("/product/")) {
      navigate("/home");
    } else {
      window.history.back();
    }
  };

  return (
    <div className="app-container h-screen flex flex-col overflow-hidden font-inter text-gray-800 bg-gray-50">
      {/* App Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 pt-4">
        {/* Back button for non-admin pages that need navigation */}
        {!isAdmin && showBackButton && (
          <div className="px-4 pb-2">
            <button 
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4">
          {children}
        </div>
      </main>
      {/* Bottom Navigation */}
      {showNavigation && <BottomNavigation />}
    </div>
  );
}
