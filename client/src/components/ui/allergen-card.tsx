import { cn } from "@/lib/utils";

interface AllergenCardProps {
  id: number;
  name: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: (id: number, selected: boolean) => void;
}

export function AllergenCard({
  id,
  name,
  icon,
  selected = false,
  onClick
}: AllergenCardProps) {
  const handleClick = () => {
    // Just pass the current selected state to parent
    onClick?.(id, selected);
  };

  return (
    <div 
      className={cn(
        "allergen-card bg-white rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all duration-200 shadow-sm",
        selected 
          ? "border-2 border-primary scale-[1.02] shadow-md" 
          : "border border-gray-100 hover:border-primary/30 hover:shadow"
      )}
      onClick={handleClick}
      data-allergen={typeof name === 'string' ? name.toLowerCase() : 'allergen'}
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
        selected ? "bg-primary/10" : "bg-gray-50"
      )}>
        {icon}
      </div>
      <span className={cn(
        "font-medium text-center transition-colors",
        selected ? "text-primary" : "text-gray-700"
      )}>
        {name}
      </span>
      {selected && (
        <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full mt-2 inline-flex items-center">
          Selected
        </span>
      )}
    </div>
  );
}
