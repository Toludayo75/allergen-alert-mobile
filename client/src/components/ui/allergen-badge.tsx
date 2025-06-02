import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AllergenBadgeProps {
  name: string;
  isDangerous?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function AllergenBadge({
  name,
  isDangerous = true,
  onRemove,
  className
}: AllergenBadgeProps) {
  return (
    <span 
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium flex items-center transition-all border",
        isDangerous
          ? "bg-orange-50 text-orange-600 border-orange-100" 
          : "bg-neutral-100 text-neutral-600 border-neutral-200",
        className
      )}
    >
      <span className={cn(
        "w-2 h-2 rounded-full mr-1.5",
        isDangerous ? "bg-orange-500" : "bg-neutral-400"
      )}></span>
      {name}
      {onRemove && (
        <button 
          onClick={onRemove} 
          className="ml-1.5 p-0.5 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}
