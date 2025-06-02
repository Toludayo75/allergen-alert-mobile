import { useQuery } from "@tanstack/react-query";

export function useAllergens() {
  const { data: allergens, isLoading, error } = useQuery({
    queryKey: ["/api/allergens"],
  });

  const { data: userAllergens, isLoading: isLoadingUserAllergens, error: userAllergensError } = useQuery({
    queryKey: ["/api/user/allergens"],
  });

  return {
    allergens,
    userAllergens,
    isLoading: isLoading || isLoadingUserAllergens,
    error: error || userAllergensError,
  };
}
