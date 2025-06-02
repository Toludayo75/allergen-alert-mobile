import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Moon, Sun, Smartphone, Globe } from "lucide-react";

export default function GeneralSettingsDetailsPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Settings state
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [appLanguage, setAppLanguage] = useState("English");
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully"
    });
  };
  
  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">General Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              {darkMode ? (
                <Moon className="h-5 w-5 text-gray-600" />
              ) : (
                <Sun className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500">Reduce eye strain in low light</p>
            </div>
          </div>
          <Switch 
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        {/* Automatic Updates */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Smartphone className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">Automatic Updates</p>
              <p className="text-xs text-gray-500">Keep app updated with latest features</p>
            </div>
          </div>
          <Switch 
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
        </div>
        
        {/* App Language */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="bg-gray-100 p-2 rounded-full mr-3">
              <Globe className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">App Language</p>
              <p className="text-xs text-gray-500">Change the application language</p>
            </div>
          </div>
          <select
            className="p-2 rounded-md border border-gray-200 bg-white text-sm"
            value={appLanguage}
            onChange={(e) => setAppLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Yoruba">Yoruba</option>
            <option value="Hausa">Hausa</option>
            <option value="Igbo">Igbo</option>
          </select>
        </div>
      </div>
      
      <Button 
        className="mt-4"
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </div>
  );
}