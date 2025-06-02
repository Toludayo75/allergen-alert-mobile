import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  Settings2, 
  Users, 
  History,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function GeneralSettingsPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Account</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* General */}
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer"
              onClick={() => navigate("/settings/general")}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Settings2 className="h-5 w-5 text-gray-600" />
                </div>
                <span>General</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Switch account */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => navigate("/settings/accounts")}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <span>Switch account</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Preferences Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Preferences</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Manage all history */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => navigate("/settings/history")}
            >
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-full mr-3">
                  <History className="h-5 w-5 text-gray-600" />
                </div>
                <span>Manage all history</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm mt-6">
          <p>App Version: 1.0.0</p>
        </div>
      </div>
    </div>
  );
}