import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { AllergenBadge } from "@/components/ui/allergen-badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Package } from "lucide-react";

export default function ProductResultPage() {
  const { nafdacNumber } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [productId, setProductId] = useState<number | null>(null);

  // Fetch product by NAFDAC number
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: [`/api/products/nafdac/${nafdacNumber}`],
    enabled: !!nafdacNumber,
  });

  // Once we have the product, fetch analysis
  const { data: analysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: [`/api/analyze/${productId}`],
    enabled: !!productId,
  });

  // Set product ID when product is fetched
  useEffect(() => {
    if (product?.id) {
      setProductId(product.id);
    }
  }, [product]);

  // Show error toast if product not found
  useEffect(() => {
    if (productError) {
      toast({
        title: "Product not found",
        description: "Please check the NAFDAC number and try again",
        variant: "destructive",
      });
    }
  }, [productError, toast]);

  // Helper function to highlight allergens in ingredients text
  const highlightAllergens = (ingredients: string, allergens: any[]) => {
    if (!ingredients || !allergens?.length) return ingredients;
    
    let result = ingredients;
    allergens.forEach(allergen => {
      const regex = new RegExp(`\\b${allergen.name}\\b`, 'gi');
      result = result.replace(
        regex, 
        `<span class="bg-warning bg-opacity-20 text-warning px-1 py-0.5 rounded font-medium">$&</span>`
      );
    });
    
    return result;
  };

  // Loading states
  const isLoading = isLoadingProduct || isLoadingAnalysis;
  const hasData = product && analysis;
  const hasAllergenMatch = analysis?.matchingAllergens?.length > 0;

  return (
    <div className="min-h-full flex flex-col p-4">
      <div className="mb-6">
        {isLoading ? (
          <div className="text-center py-8">Loading product information...</div>
        ) : hasData ? (
          <>
            {/* Product with Allergen Warning */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              {/* Warning Banner for Allergens */}
              {hasAllergenMatch ? (
                <div className="bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-lg p-3 mb-4 flex items-start">
                  <AlertTriangle className="h-6 w-6 text-warning mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-warning">Contains Allergens</h4>
                    <p className="text-sm">This product contains allergens you're sensitive to</p>
                  </div>
                </div>
              ) : (
                <div className="bg-green-100 border border-primary border-opacity-20 rounded-lg p-3 mb-4 flex items-start">
                  <Package className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-primary">Safe Product</h4>
                    <p className="text-sm">This product does not contain any of your allergens</p>
                  </div>
                </div>
              )}

              {/* Product Information */}
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-lg bg-neutral-100 flex-shrink-0 flex items-center justify-center mr-3">
                  <Package className="h-8 w-8 text-neutral-500" />
                </div>
                <div>
                  <h3 className="font-nunito font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.manufacturer}</p>
                  <p className="text-xs text-gray-500">NAFDAC: {product.nafdacNumber}</p>
                </div>
              </div>

              {/* Ingredients with Highlighted Allergens */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Ingredients:</h4>
                <p 
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightAllergens(product.ingredients, analysis.productAllergens) 
                  }}
                />
              </div>

              {/* Allergen Summary */}
              <div className="bg-neutral-100 rounded-lg p-3">
                <h4 className="font-medium mb-2">Allergens Found:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.productAllergens.map((allergen: any) => (
                    <AllergenBadge 
                      key={allergen.id} 
                      name={allergen.name} 
                      isDangerous={analysis.matchingAllergens.some((a: any) => a.id === allergen.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Alternative Products Recommendations */}
            {hasAllergenMatch && analysis.alternatives?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-nunito font-semibold text-lg mb-3">Safe Alternatives</h3>
                <div className="space-y-3">
                  {analysis.alternatives.map((alternative: any) => (
                    <ProductCard
                      key={alternative.id}
                      id={alternative.id}
                      name={alternative.name}
                      manufacturer={alternative.manufacturer}
                      hasDangerousAllergens={false}
                      onClick={() => navigate(`/product/${alternative.nafdacNumber}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md"
              onClick={() => navigate("/home")}
            >
              Back to Search
            </Button>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Product not found. Please check the NAFDAC number and try again.</p>
            <Button 
              className="mt-4 bg-primary text-white"
              onClick={() => navigate("/home")}
            >
              Back to Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
