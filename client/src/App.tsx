import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import WelcomePage from "@/pages/WelcomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RegistrationCompletePage from "@/pages/RegistrationCompletePage";
import HomePage from "@/pages/HomePage";
import ProductResultPage from "@/pages/ProductResultPage";
import ProfilePage from "@/pages/ProfilePage";
import EditProfilePage from "@/pages/EditProfilePage";
import AllergenManagementPage from "@/pages/AllergenManagementPage";

import EducationPage from "@/pages/EducationPage";
import EducationalResourcesPage from "@/pages/EducationalResourcesPage";
import AdminPage from "@/pages/AdminPage";
import OnboardingPage from "@/pages/OnboardingPage";
import GeneralSettingsPage from "@/pages/GeneralSettingsPage";
import GeneralSettingsDetailsPage from "@/pages/GeneralSettingsDetailsPage";
import AccountSwitchPage from "@/pages/AccountSwitchPage";
import HistoryManagementPage from "@/pages/HistoryManagementPage";
import AppLayout from "@/components/layout/AppLayout";
import { MobilePageTransition } from "@/components/layout/MobilePageTransition";
import { useAuth } from "@/hooks/use-auth";

function Router() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirect based on authentication and admin status
  useEffect(() => {
    // Public routes that anyone can access
    const publicRoutes = ["/", "/welcome", "/login", "/register", "/registration-complete"];
    
    // If not authenticated, redirect to onboarding page
    if (!isLoading && !isAuthenticated && !publicRoutes.includes(location)) {
      setLocation("/");
      return;
    }
    
    // If authenticated as admin, only allow access to admin dashboard
    if (!isLoading && isAuthenticated && isAdmin) {
      if (location !== "/admin" && !publicRoutes.includes(location)) {
        setLocation("/admin");
        return;
      }
    }
    
    // If authenticated as regular user, prevent access to admin dashboard
    if (!isLoading && isAuthenticated && !isAdmin && location === "/admin") {
      setLocation("/home");
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, location, setLocation]);

  // Render different routes based on user type
  if (isAuthenticated && isAdmin) {
    return (
      <Switch>
        {/* Admin only has access to admin dashboard */}
        <Route path="/admin" component={AdminPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/logout" component={() => {
          // Clear query cache and redirect
          queryClient.clear();
          window.location.href = "/api/logout";
          return null;
        }} />
        {/* Fallback to admin */}
        <Route path="*" component={() => {
          window.location.href = "/admin";
          return null;
        }} />
      </Switch>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={OnboardingPage} />
      <Route path="/welcome" component={WelcomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/registration-complete" component={RegistrationCompletePage} />
      
      {/* Regular user protected routes */}
      <Route path="/home" component={HomePage} />
      <Route path="/product/:nafdacNumber" component={ProductResultPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile/edit" component={EditProfilePage} />
      <Route path="/profile/allergens" component={AllergenManagementPage} />
      <Route path="/settings" component={GeneralSettingsPage} />
      <Route path="/settings/general" component={GeneralSettingsDetailsPage} />
      <Route path="/settings/accounts" component={AccountSwitchPage} />
      <Route path="/settings/history" component={HistoryManagementPage} />
      <Route path="/education" component={EducationPage} />
      <Route path="/education/resources" component={EducationalResourcesPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <MobilePageTransition>
            <AnimatePresence mode="wait">
              <Router />
            </AnimatePresence>
          </MobilePageTransition>
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;