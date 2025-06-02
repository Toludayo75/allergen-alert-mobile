import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, History, Trash2, Search } from "lucide-react";

// Mock data for sample search history
const sampleHistory = [
  { id: 1, productName: "Nutrilon Premium Infant Formula", date: "Today", time: "15:30" },
  { id: 2, productName: "Golden Penny Semolina", date: "Today", time: "12:15" },
  { id: 3, productName: "Indomie Instant Noodles", date: "Yesterday", time: "19:45" },
  { id: 4, productName: "Peak Milk Powder", date: "Yesterday", time: "10:20" },
  { id: 5, productName: "Blue Band Margarine", date: "2 days ago", time: "08:30" }
];

export default function HistoryManagementPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [history, setHistory] = useState(sampleHistory);
  
  const handleClearHistory = () => {
    setHistory([]);
    toast({
      title: "History cleared",
      description: "Your search history has been cleared"
    });
  };
  
  const handleRemoveItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "The history item has been removed"
    });
  };
  
  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">Search History</h1>
      </div>

      {history.length > 0 ? (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            {history.map((item, index) => (
              <div 
                key={item.id}
                className={`p-4 flex items-center justify-between ${
                  index !== history.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <Search className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.date} at {item.time}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            variant="outline"
            className="flex items-center justify-center text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleClearHistory}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All History
          </Button>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <History className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No search history</h3>
          <p className="text-gray-500 mb-6">
            Your search history will appear here after you search for products.
          </p>
          <Button onClick={() => navigate("/home")}>
            Go to Home
          </Button>
        </div>
      )}
    </div>
  );
}