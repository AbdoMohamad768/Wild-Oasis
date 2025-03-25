import { useQuery } from "@tanstack/react-query";
import { apiCountries } from "../services/apiCountries";

export function useCountryFlags() {
  const { data: countries, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: apiCountries,
  });

  return { countries, isLoading };
}
