import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useProducts() {
  const [nafdacNumber, setNafdacNumber] = useState<string | null>(null);
  const [productId, setProductId] = useState<number | null>(null);

  // Fetch product by NAFDAC number
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: nafdacNumber ? [`/api/products/nafdac/${nafdacNumber}`] : [],
    enabled: !!nafdacNumber,
  });

  // Fetch product analysis
  const {
    data: analysis,
    isLoading: isLoadingAnalysis,
    error: analysisError,
  } = useQuery({
    queryKey: productId ? [`/api/analyze/${productId}`] : [],
    enabled: !!productId,
  });

  return {
    product,
    analysis,
    isLoading: isLoadingProduct || isLoadingAnalysis,
    error: productError || analysisError,
    setNafdacNumber,
    setProductId,
  };
}
