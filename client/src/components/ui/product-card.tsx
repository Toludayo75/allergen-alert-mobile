import { ChevronRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: number;
  name: string;
  manufacturer?: string;
  nafdacNumber?: string;
  hasDangerousAllergens?: boolean;
  onClick?: () => void;
}

export function ProductCard({
  id,
  name,
  manufacturer,
  nafdacNumber,
  hasDangerousAllergens = false,
  onClick
}: ProductCardProps) {
  return (
    <div 
      className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 flex items-center space-x-3 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/20"
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-primary/5 flex-shrink-0 flex items-center justify-center">
        <Package className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 ml-1">
        <h4 className="font-medium text-gray-800">{name}</h4>
        {manufacturer && (
          <p className="text-xs text-gray-500">{manufacturer}</p>
        )}
        {hasDangerousAllergens !== undefined && (
          <div className="flex items-center text-sm mt-2">
            <span 
              className={cn(
                "px-2 py-0.5 rounded-md text-xs font-medium inline-flex items-center",
                hasDangerousAllergens 
                  ? "bg-orange-50 text-orange-600 border border-orange-100" 
                  : "bg-green-50 text-green-600 border border-green-100"
              )}
            >
              {hasDangerousAllergens ? (
                <>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1"></span>
                  Contains allergens
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  Safe for you
                </>
              )}
            </span>
          </div>
        )}
      </div>
      <div className="bg-gray-50 h-8 w-8 flex items-center justify-center rounded-full">
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
