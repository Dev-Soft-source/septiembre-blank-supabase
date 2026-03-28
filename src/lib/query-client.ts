
import { QueryClient } from "@tanstack/react-query";

// Create a client
export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export const queryClient = createQueryClient();
