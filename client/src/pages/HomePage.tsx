
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";
import { motion } from "framer-motion";

// Animation variants for staggered list items
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function HomePage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [nafdacNumber, setNafdacNumber] = useState("");
  const queryClient = useQueryClient();

  // Get user data
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  // Get recent search history
  const { data: recentSearches, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["/api/user/history"],
  });

  const handleSearch = () => {
    if (!nafdacNumber.trim()) {
      toast({
        title: "Please enter a NAFDAC number",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/product/${nafdacNumber}`);
  };
  
  // Handle refresh when user pulls down
  const handleRefresh = async () => {
    // Refresh all the queries
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ["/api/user"] }),
      queryClient.refetchQueries({ queryKey: ["/api/user/history"] })
    ]);
    
    // Show toast to confirm refresh
    toast({
      title: "Data refreshed",
      description: "Your information has been updated",
    });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} className="min-h-full">
      <motion.div 
        className="min-h-full flex flex-col p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
        >
          <motion.div 
            className="bg-gradient-to-r from-primary to-green-400 text-white p-4 rounded-xl mb-6 shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h2 className="text-2xl font-nunito font-bold">
              Welcome, <span>{user?.fullName?.split(' ')[0] || 'User'}</span>
            </h2>
            <p className="text-white/80 text-sm mt-1">Check food products for allergens</p>
          </motion.div>
        
          {/* Search for products */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-nunito font-semibold text-lg mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2 text-primary" />
                Search Products
              </h3>
              <div className="mb-4">
                <label htmlFor="nafdac-number" className="block text-sm font-medium text-gray-700 mb-2">
                  NAFDAC Number
                </label>
                <div className="relative">
                  <Input
                    id="nafdac-number"
                    placeholder="e.g. A1-2345"
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pl-10"
                    value={nafdacNumber}
                    onChange={(e) => setNafdacNumber(e.target.value)}
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-sm transition-all"
                onClick={handleSearch}
              >
                Search
              </Button>
              <div className="mt-3 text-center">
                <a href="#" className="text-sm text-secondary hover:text-secondary/80 transition-colors">
                  Or search by product name
                </a>
              </div>
            </div>
          </div>

          {/* Recent Searched Products */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-nunito font-semibold text-lg mb-4 flex items-center">
              <span className="inline-block w-5 h-5 bg-primary/10 rounded-full text-primary text-center mr-2">↻</span>
              Recently Viewed
            </h3>
            {isLoadingHistory ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : recentSearches?.length > 0 ? (
              <div className="space-y-3">
                {recentSearches.map((item: any) => (
                  <ProductCard
                    key={`${item.product.id}-${item.createdAt}`}
                    id={item.product.id}
                    name={item.product.name}
                    manufacturer={item.product.manufacturer}
                    hasDangerousAllergens={true}
                    onClick={() => navigate(`/product/${item.product.nafdacNumber}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">No search history yet</p>
                <p className="text-sm text-gray-400">Start by searching for a product above!</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </PullToRefresh>
  );
}
