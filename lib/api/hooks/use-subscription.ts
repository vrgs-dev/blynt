import { useQuery } from '@tanstack/react-query';
import { getSubscription } from '../subscription';

export function useSubscription() {
    return useQuery({
        queryKey: ['subscription'],
        queryFn: getSubscription,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    });
}
