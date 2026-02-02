import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, disableAccount, UpdateSettingsRequest } from '../settings';

export function useSettings() {
    return useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

interface UseUpdateSettingsOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useUpdateSettings(options?: UseUpdateSettingsOptions) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSettingsRequest) => updateSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            options?.onSuccess?.();
        },
        onError: options?.onError,
    });
}

interface UseDisableAccountOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useDisableAccount(options?: UseDisableAccountOptions) {
    return useMutation({
        mutationFn: (confirmation: string) => disableAccount(confirmation),
        onSuccess: options?.onSuccess,
        onError: options?.onError,
    });
}
