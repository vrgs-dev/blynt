import { useQuery } from '@tanstack/react-query';
import { getPlans } from '../plans';

export function usePlans() {
    return useQuery({
        queryKey: ['plans'],
        queryFn: getPlans,
        staleTime: 10 * 60 * 1000, // 10 minutes - plans don't change often
    });
}
