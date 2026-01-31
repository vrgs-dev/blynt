'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 minutes instead of 1
                        gcTime: 10 * 60 * 1000, // 10 minutes
                        retry: 1,
                        refetchOnWindowFocus: false, // Prevent refetching when switching tabs
                        refetchOnMount: false, // Prevent refetching when navigating back if data is fresh
                    },
                    mutations: {
                        retry: 0,
                    },
                },
            }),
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
