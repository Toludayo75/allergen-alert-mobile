import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserCircle, User, Plus } from "lucide-react";

// Mock data for sample accounts
const sampleAccounts = [
  { id: 1, name: "Primary Account", email: "user@example.com", isActive: true },
  { id: 2, name: "Work Account", email: "work@example.com", isActive: false }
];

export default function AccountSwitchPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(sampleAccounts);
  
  const handleSwitchAccount = (id: number) => {
    // Update the active account
    const updatedAccounts = accounts.map(account => ({
      ...account,
      isActive: account.id === id
    }));
    
    setAccounts(updatedAccounts);
    
    toast({
      title: "Account switched",
      description: "You are now using a different account"
    });
  };
  
  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Switch Account</h1>
      </div>

      <div className="space-y-4">
        {accounts.map(account => (
          <div 
            key={account.id}
            className={`bg-white rounded-xl shadow-md p-4 flex items-center ${
              account.isActive ? 'border-2 border-primary' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${
              account.isActive ? 'bg-primary text-white' : 'bg-gray-100'
            }`}>
              <UserCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{account.name}</h3>
              <p className="text-sm text-gray-500">{account.email}</p>
            </div>
            {account.isActive ? (
              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                Active
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSwitchAccount(account.id)}
              >
                Switch
              </Button>
            )}
          </div>
        ))}
        
        <Button
          variant="outline"
          className="w-full mt-4 flex items-center justify-center"
          onClick={() => navigate("/login")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Account
        </Button>
      </div>
    </div>
  );
}