// providers/AppProviders.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { StateProvider } from "../providers/StateProvider";  // 🔴 여기!

const queryClient = new QueryClient();

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>
            <StateProvider>
              {children}
            </StateProvider>
        </QueryClientProvider>;
}