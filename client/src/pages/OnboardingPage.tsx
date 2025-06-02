import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AllergenCard } from "@/components/ui/allergen-card";
import { commonAllergens, getAllergenIcon } from "@/assets/allergens";
import { 
  Check, 
  ArrowRight,
  BookOpen,
  Search,
  AlertTriangle,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  
  const totalSteps = 4;
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate("/login"); // Go to login page when onboarding is complete
    }
  };
  
  const handleToggleAllergen = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedAllergens(prev => prev.filter(allergenId => allergenId !== id));
    } else {
      setSelectedAllergens(prev => [...prev, id]);
    }
  };
  
  return (
    <div className="min-h-full flex flex-col p-4">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
          <Button 
            variant="ghost" 
            className="text-sm text-primary"
            onClick={() => navigate("/login")}
          >
            Skip
          </Button>
        </div>
        <div className="w-full bg-gray-200 h-1 rounded-full">
          <div 
            className="bg-primary h-1 rounded-full transition-all" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="flex-1">
        {step === 1 && (
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Welcome to Allergen Alert</h1>
            <p className="text-gray-600 mb-6">
              Your personal assistant for managing food allergies and staying safe.
            </p>
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Identify Allergens</p>
                  <p className="text-sm text-gray-600">Scan food products to check for allergens</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Find Alternatives</p>
                  <p className="text-sm text-gray-600">Discover safe alternatives for products you can't consume</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Learn About Allergies</p>
                  <p className="text-sm text-gray-600">Educational resources to help manage allergies</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">How to Search Products</h1>
            <p className="text-gray-600 mb-6">
              Use the NAFDAC number to quickly find product information.
            </p>
            
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Find the NAFDAC Number</p>
                    <p className="text-sm text-gray-600">Look for the number on the product packaging</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Enter the Number</p>
                    <p className="text-sm text-gray-600">Type the NAFDAC number in the search bar</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Review Results</p>
                    <p className="text-sm text-gray-600">Check allergen warnings and information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Understanding Alerts</h1>
            <p className="text-gray-600 mb-6">
              We'll alert you when a product contains allergens you need to avoid.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="font-semibold text-red-600">Danger Alert</p>
                </div>
                <p className="text-sm text-gray-600">
                  Product contains allergens that you're allergic to. Avoid consumption.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                  <p className="font-semibold text-yellow-600">Warning Alert</p>
                </div>
                <p className="text-sm text-gray-600">
                  Product may contain traces of allergens or was produced in a facility that processes allergens.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center mb-2">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-semibold text-green-600">Safe to Consume</p>
                </div>
                <p className="text-sm text-gray-600">
                  Product does not contain any of your registered allergens.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Zap className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">You're All Set!</h1>
            <p className="text-gray-600 mb-8">
              You're now ready to start using Allergen Alert to manage your food allergies safely.
            </p>
            
            <div className="bg-white rounded-xl shadow-md p-4 mb-8">
              <h3 className="font-semibold text-lg mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-left">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Update your allergen profile anytime in settings</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Check the Education section for helpful resources</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Search products using the NAFDAC number</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm">Find safe alternatives when a product isn't suitable</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="mt-auto">
        <Button
          className="w-full bg-primary text-white"
          onClick={handleNext}
        >
          {step === totalSteps ? 'Get Started' : 'Continue'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}