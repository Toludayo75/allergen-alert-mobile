import React from "react";
import { 
  AlertCircle, 
  Milk, 
  Wheat, 
  Egg, 
  Fish, 
  SproutIcon, 
  Banana,
  Nut,
  Apple,
  Shell
} from "lucide-react";

type AllergenIcon = Record<string, React.ReactNode>;

const allergenIcons: AllergenIcon = {
  "peanuts": React.createElement(Nut, { className: "h-8 w-8 text-neutral-500" }),
  "dairy": React.createElement(Milk, { className: "h-8 w-8 text-neutral-500" }),
  "wheat": React.createElement(Wheat, { className: "h-8 w-8 text-neutral-500" }),
  "eggs": React.createElement(Egg, { className: "h-8 w-8 text-neutral-500" }),
  "shellfish": React.createElement(Shell, { className: "h-8 w-8 text-neutral-500" }),
  "soy": React.createElement(SproutIcon, { className: "h-8 w-8 text-neutral-500" }),
  "fish": React.createElement(Fish, { className: "h-8 w-8 text-neutral-500" }),
  "tree_nuts": React.createElement(Banana, { className: "h-8 w-8 text-neutral-500" }),
  "fruits": React.createElement(Apple, { className: "h-8 w-8 text-neutral-500" }),
  "default": React.createElement(AlertCircle, { className: "h-8 w-8 text-neutral-500" })
};

export function getAllergenIcon(iconName: string): React.ReactNode {
  return allergenIcons[iconName] || allergenIcons.default;
}

export const commonAllergens = [
  { id: 1, name: "Peanuts", icon: "peanuts", description: "Common legume that can cause severe allergic reactions" },
  { id: 2, name: "Dairy", icon: "dairy", description: "Includes milk and milk products" },
  { id: 3, name: "Wheat", icon: "wheat", description: "Contains gluten which affects people with celiac disease" },
  { id: 4, name: "Eggs", icon: "eggs", description: "Common in many foods including baked goods" },
  { id: 5, name: "Shellfish", icon: "shellfish", description: "Includes shrimp, crab, and lobster" },
  { id: 6, name: "Soy", icon: "soy", description: "Found in many processed foods" },
  { id: 7, name: "Fish", icon: "fish", description: "Various types of fish can cause allergic reactions" },
  { id: 8, name: "Tree Nuts", icon: "tree_nuts", description: "Includes walnuts, almonds, cashews, and more" }
];
